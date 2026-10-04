import fs from 'fs';
import https from 'https';
import path from 'path';

// Disable TLS verification for some tricky CDNs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const outDir = path.join(process.cwd(), 'public', 'img', 'media');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const downloads = [
  // Anime
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx149885-bIv0x8hL5sI3.jpg', file: 'bleach-cover.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/149885-j9pP5E1h4ZzW.jpg', file: 'bleach-banner.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx110277-2S1qXosVn39i.jpg', file: 'aot-cover.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/110277-1rR7O9y6HntK.jpg', file: 'aot-banner.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145064-GfP1sL0hB4zB.png', file: 'jjk-cover.png' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/145064-x79V0h36hP6F.jpg', file: 'jjk-banner.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101348-D0Kst3Yl432a.jpg', file: 'vinland-cover.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/101348-oN800v682a8k.jpg', file: 'vinland-banner.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx1-CXtrrkLu1coR.png', file: 'bebop-cover.png' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjF6wq2w.jpg', file: 'bebop-banner.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9253-xT2h0kF0EaWa.png', file: 'steins-cover.png' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/9253-3nNOniUqN12u.jpg', file: 'steins-banner.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1gX3iqITFCY.jpg', file: 'solo-cover.jpg' },
  { url: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-fU4sPjQYfAte.jpg', file: 'solo-banner.jpg' },
  
  // Games
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg', file: 'elden-banner.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg', file: 'elden-cover.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_8e2e9ff411b40280b153ff2a7e7bcda2da03d08c.1920x1080.jpg', file: 'elden-s1.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_493ed2c938ed99464e8ea775efc2bf4bc63b9055.1920x1080.jpg', file: 'elden-s2.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/ss_0cc2fb516f40776b97b0d9c490a072049e3cf40f.1920x1080.jpg', file: 'elden-s3.jpg' },
  
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_hero.jpg', file: 'sekiro-banner.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg', file: 'sekiro-cover.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/ss_4cf57ec1b01777dcba8c1a6341d3ce3fc8cb9f19.1920x1080.jpg', file: 'sekiro-s1.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/ss_dd569bd8c005b79e83ec86566088295b926dd18c.1920x1080.jpg', file: 'sekiro-s2.jpg' },
  
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/374320/library_hero.jpg', file: 'ds3-banner.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/374320/library_600x900.jpg', file: 'ds3-cover.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/374320/ss_bf491223e7f428ce0a9f46cb9fb07455850ab89e.1920x1080.jpg', file: 'ds3-s1.jpg' },
  
  { url: 'https://images.igdb.com/igdb/image/upload/t_1080p/ar4d5.jpg', file: 'bb-banner.jpg' },
  { url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7f.png', file: 'bb-cover.png' },
  { url: 'https://images.igdb.com/igdb/image/upload/t_1080p/sclh7y.jpg', file: 'bb-s1.jpg' },
  
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg', file: 'cyberpunk-banner.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg', file: 'cyberpunk-cover.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/ss_26e5fc56fb5bdcead3c621535492d19dcb29d2f6.1920x1080.jpg', file: 'cyberpunk-s1.jpg' },
  
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_hero.jpg', file: 'wukong-banner.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg', file: 'wukong-cover.jpg' },
  { url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/ss_5976bcf64188cd5642a4282c0356c3ce446a8bc6.1920x1080.jpg', file: 'wukong-s1.jpg' },
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, filename);
    if (fs.existsSync(dest)) return resolve(dest);
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(dest);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  for (const item of downloads) {
    console.log(`Downloading ${item.file}...`);
    try {
      await downloadImage(item.url, item.file);
    } catch (e) {
      console.error(`Error downloading ${item.file}`, e.message);
    }
  }
  console.log('All downloads finished.');
}
main();
