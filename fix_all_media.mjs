import fs from 'fs';
import https from 'https';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
      return resolve(true); // Already downloaded
    }
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', reject);
  });
}

const iconsDir = path.join(process.cwd(), 'public', 'img', 'icons');
const mediaDir = path.join(process.cwd(), 'public', 'img', 'media');

async function main() {
  // --- ICONS ---
  const icons = [
    // Spotify - official green icon from macOS Big Sur pack
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png', dest: path.join(iconsDir, 'spotify.png') },
    // Steam - official icon
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/512px-Steam_icon_logo.svg.png', dest: path.join(iconsDir, 'steam.png') },
    // After Effects
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Adobe_After_Effects_CC_icon.svg/512px-Adobe_After_Effects_CC_icon.svg.png', dest: path.join(iconsDir, 'aftereffects.png') },
    // Crunchyroll
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Crunchyroll_Logo.svg/512px-Crunchyroll_Logo.svg.png', dest: path.join(iconsDir, 'crunchyroll.png') },
    // YouTube (use original high-res)
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png', dest: path.join(iconsDir, 'youtube.png') },
  ];

  for (const icon of icons) {
    console.log(`Downloading icon: ${path.basename(icon.dest)}`);
    try {
      // Force re-download by deleting first
      if (fs.existsSync(icon.dest)) fs.unlinkSync(icon.dest);
      await download(icon.url, icon.dest);
      const size = fs.statSync(icon.dest).size;
      console.log(`  OK: ${size} bytes`);
    } catch (e) {
      console.error(`  FAIL: ${e.message}`);
    }
  }

  // --- ANIME IMAGES via Jikan API ---
  const animeList = [
    { id: 'bleach', query: 'Bleach: Thousand-Year Blood War' },
    { id: 'aot', query: 'Attack on Titan' },
    { id: 'jjk', query: 'Jujutsu Kaisen' },
    { id: 'vinland', query: 'Vinland Saga' },
    { id: 'bebop', query: 'Cowboy Bebop' },
    { id: 'steins', query: 'Steins;Gate' },
    { id: 'solo', query: 'Solo Leveling' },
  ];

  for (const anime of animeList) {
    console.log(`\nFetching anime: ${anime.query}`);
    try {
      const apiUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(anime.query)}&limit=1`;
      const data = await new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
        }).on('error', reject);
      });

      if (data.data && data.data[0]) {
        const item = data.data[0];
        const cover = item.images.jpg.large_image_url;
        const coverDest = path.join(mediaDir, `${anime.id}-cover.jpg`);
        if (fs.existsSync(coverDest)) fs.unlinkSync(coverDest);
        await download(cover, coverDest);
        console.log(`  cover: ${cover}`);

        // Use the cover as banner too (banner not in jikan)
        const bannerDest = path.join(mediaDir, `${anime.id}-banner.jpg`);
        if (fs.existsSync(bannerDest)) fs.unlinkSync(bannerDest);
        await download(cover, bannerDest);
        console.log(`  banner: same as cover`);
      }
    } catch (e) {
      console.error(`  FAIL: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1200)); // 1.2s between requests
  }

  // --- GAMES via Steam API ---
  const gameList = [
    { id: 'elden', appId: 1245620 },
    { id: 'sekiro', appId: 814380 },
    { id: 'ds3', appId: 374320 },
    { id: 'cyberpunk', appId: 1091500 },
    { id: 'wukong', appId: 2358720 },
  ];

  for (const game of gameList) {
    console.log(`\nFetching game appId: ${game.appId}`);
    try {
      const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${game.appId}`;
      const data = await new Promise((resolve, reject) => {
        https.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          let body = '';
          res.on('data', c => body += c);
          res.on('end', () => { try { resolve(JSON.parse(body)); } catch(e) { reject(e); } });
        }).on('error', reject);
      });

      const info = data[game.appId];
      if (info && info.success) {
        const gdata = info.data;
        const bannerDest = path.join(mediaDir, `${game.id}-banner.jpg`);
        if (fs.existsSync(bannerDest)) fs.unlinkSync(bannerDest);
        await download(gdata.header_image, bannerDest);
        console.log(`  banner: ${gdata.header_image}`);

        const capsule = gdata.capsule_imagev5 || gdata.capsule_image;
        if (capsule) {
          const coverDest = path.join(mediaDir, `${game.id}-cover.jpg`);
          if (fs.existsSync(coverDest)) fs.unlinkSync(coverDest);
          await download(capsule, coverDest);
          console.log(`  cover: ${capsule}`);
        }

        if (gdata.screenshots) {
          for (let i = 0; i < Math.min(3, gdata.screenshots.length); i++) {
            const ssDest = path.join(mediaDir, `${game.id}-s${i+1}.jpg`);
            if (fs.existsSync(ssDest)) fs.unlinkSync(ssDest);
            await download(gdata.screenshots[i].path_full, ssDest);
            console.log(`  screenshot ${i+1}: OK`);
          }
        }
      }
    } catch(e) {
      console.error(`  FAIL: ${e.message}`);
    }
  }

  // Bloodborne (PS4 only, use IGDB)
  console.log('\nFetching Bloodborne images...');
  const bbImages = [
    { url: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar4d5.jpg', dest: path.join(mediaDir, 'bb-banner.jpg') },
    { url: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co1r7f.jpg', dest: path.join(mediaDir, 'bb-cover.jpg') },
    { url: 'https://images.igdb.com/igdb/image/upload/t_1080p/sclh7y.jpg', dest: path.join(mediaDir, 'bb-s1.jpg') },
  ];
  for (const img of bbImages) {
    if (fs.existsSync(img.dest)) fs.unlinkSync(img.dest);
    try { await download(img.url, img.dest); console.log(`  ${path.basename(img.dest)}: OK`); }
    catch(e) { console.error(`  ${path.basename(img.dest)}: FAIL - ${e.message}`); }
  }

  console.log('\n=== ALL DONE ===');
}

main();
