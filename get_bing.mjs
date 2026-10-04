import https from 'https';
import fs from 'fs';

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getImages(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query + ' site:i.pinimg.com')}`;
  const html = await fetchHtml(url);
  
  const matches = [...html.matchAll(/https:\/\/i\.pinimg\.com\/[a-z0-9\/_-]+\.jpg/gi)];
  const urls = [...new Set(matches.map(m => m[0]))];
  
  if (urls.length === 0) {
    const matches2 = [...html.matchAll(/i\.pinimg\.com[a-z0-9\/_-]+\.jpg/gi)];
    urls.push(...new Set(matches2.map(m => 'https://' + m[0])));
  }

  console.log(`\n--- ${query} ---`);
  urls.slice(0, 4).forEach(u => console.log(u));
}

async function main() {
  await getImages('Elden Ring wallpaper');
  await getImages('Sekiro wallpaper');
  await getImages('Dark Souls 3 wallpaper');
  await getImages('Bloodborne wallpaper');
  await getImages('Cyberpunk 2077 wallpaper');
  await getImages('Black Myth Wukong wallpaper');
  await getImages('Bleach anime aesthetic');
  await getImages('Attack on Titan aesthetic');
  await getImages('Jujutsu Kaisen aesthetic');
  await getImages('Vinland Saga aesthetic');
  await getImages('Cowboy Bebop aesthetic');
  await getImages('Steins Gate aesthetic');
  await getImages('Solo Leveling aesthetic');
}

main();
