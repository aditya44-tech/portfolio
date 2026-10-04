import fs from 'fs';
import https from 'https';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'img', 'media');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, filename);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return resolve(null); // Ignore errors, return null
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(`/img/media/${filename}`); });
    }).on('error', () => resolve(null));
  });
}

async function getAnime(title, id) {
  try {
    const data = await fetchJson(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`);
    if (data && data.data && data.data.length > 0) {
      const anime = data.data[0];
      const coverUrl = anime.images.jpg.large_image_url;
      let bannerUrl = coverUrl; // fallback
      
      const cover = await downloadImage(coverUrl, `${id}-cover.jpg`);
      const banner = await downloadImage(bannerUrl, `${id}-banner.jpg`);
      return { cover, banner };
    }
  } catch (e) { console.error(`Error on anime ${title}`, e); }
  return { cover: null, banner: null };
}

async function getGame(title, appId, id) {
  // Use Steam API for game data
  try {
    const data = await fetchJson(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
    if (data && data[appId] && data[appId].success) {
      const game = data[appId].data;
      const bannerUrl = game.header_image;
      const coverUrl = game.capsule_imagev5 || game.header_image;
      
      const banner = await downloadImage(bannerUrl, `${id}-banner.jpg`);
      const cover = await downloadImage(coverUrl, `${id}-cover.jpg`);
      
      const screenshots = [];
      if (game.screenshots) {
        for (let i = 0; i < Math.min(3, game.screenshots.length); i++) {
          const s = await downloadImage(game.screenshots[i].path_full, `${id}-s${i+1}.jpg`);
          if (s) screenshots.push(s);
        }
      }
      return { banner, cover, screenshots };
    }
  } catch (e) { console.error(`Error on game ${title}`, e); }
  return { banner: null, cover: null, screenshots: [] };
}

async function updateDataFiles() {
  console.log("Fetching Anime...");
  const animeData = [
    { id: 'bleach', title: 'Bleach' },
    { id: 'aot', title: 'Attack on Titan' },
    { id: 'jjk', title: 'Jujutsu Kaisen' },
    { id: 'vinland', title: 'Vinland Saga' },
    { id: 'bebop', title: 'Cowboy Bebop' },
    { id: 'steins', title: 'Steins Gate' },
    { id: 'solo', title: 'Solo Leveling' }
  ];
  const animeResults = {};
  for (const a of animeData) {
    animeResults[a.id] = await getAnime(a.title, a.id);
    await new Promise(r => setTimeout(r, 1000)); // Rate limit Jikan API
  }

  console.log("Fetching Games...");
  const gamesData = [
    { id: 'elden', appId: 1245620, title: 'Elden Ring' },
    { id: 'sekiro', appId: 814380, title: 'Sekiro' },
    { id: 'ds3', appId: 374320, title: 'Dark Souls 3' },
    { id: 'cyberpunk', appId: 1091500, title: 'Cyberpunk' },
    { id: 'wukong', appId: 2358720, title: 'Black Myth Wukong' },
  ];
  const gameResults = {};
  for (const g of gamesData) {
    gameResults[g.id] = await getGame(g.title, g.appId, g.id);
  }
  
  // Bloodborne isn't on Steam, manual IGDB grab
  gameResults['bb'] = {
    banner: await downloadImage('https://images.igdb.com/igdb/image/upload/t_1080p/ar4d5.jpg', 'bb-banner.jpg'),
    cover: await downloadImage('https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.jpg', 'bb-cover.jpg'),
    screenshots: [await downloadImage('https://images.igdb.com/igdb/image/upload/t_1080p/sclh7y.jpg', 'bb-s1.jpg')]
  };

  console.log("Updating files...");
  
  // Update anime.ts
  const animePath = path.join(process.cwd(), 'src', 'data', 'anime.ts');
  let aContent = fs.readFileSync(animePath, 'utf8');
  let aIndex = 0;
  aContent = aContent.replace(/coverImage: "[^"]+"/g, () => `coverImage: "${animeResults[animeData[aIndex % animeData.length].id].cover || '/img/media/placeholder.jpg'}"`);
  aIndex = 0;
  aContent = aContent.replace(/bannerImage: "[^"]+"/g, () => `bannerImage: "${animeResults[animeData[Math.floor(aIndex++/2) % animeData.length].id].banner || '/img/media/placeholder.jpg'}"`);
  fs.writeFileSync(animePath, aContent);

  // Update games.ts
  const gamesPath = path.join(process.cwd(), 'src', 'data', 'games.ts');
  let gContent = fs.readFileSync(gamesPath, 'utf8');
  const gOrder = ['elden', 'sekiro', 'ds3', 'bb', 'cyberpunk', 'wukong'];
  
  gContent = gContent.replace(/banner: "[^"]+"/g, (match, offset, str) => {
    // hacky sequential replacement
    const g = gameResults[gOrder.shift()];
    return `banner: "${g.banner || '/img/media/placeholder.jpg'}"`;
  });
  
  const gOrder2 = ['elden', 'sekiro', 'ds3', 'bb', 'cyberpunk', 'wukong'];
  gContent = gContent.replace(/cover: "[^"]+"/g, (match, offset, str) => {
    const g = gameResults[gOrder2.shift()];
    return `cover: "${g.cover || '/img/media/placeholder.jpg'}"`;
  });
  
  const gOrder3 = ['elden', 'sekiro', 'ds3', 'bb', 'cyberpunk', 'wukong'];
  gContent = gContent.replace(/screenshots: \[\s*(?:"[^"]+",?\s*)*\]/g, (match, offset, str) => {
    const g = gameResults[gOrder3.shift()];
    const shots = g.screenshots.map(s => `"${s}"`).join(',\n      ');
    return `screenshots: [\n      ${shots}\n    ]`;
  });
  fs.writeFileSync(gamesPath, gContent);
  
  console.log("Done fetching and applying real media!");
}

updateDataFiles();
