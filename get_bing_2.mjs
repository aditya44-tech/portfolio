import https from 'https';

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function getImages(query) {
  const url = `https://www.bing.com/images/search?q=${encodeURIComponent(query + ' site:i.pinimg.com')}`;
  const html = await fetchHtml(url);
  
  const matches = [...html.matchAll(/murl&quot;:&quot;(https:\/\/i\.pinimg\.com[^&]+?)&quot;/g)];
  const urls = [...new Set(matches.map(m => m[1]))];
  
  if (urls.length === 0) {
    const rawMatches = [...html.matchAll(/https:\/\/i\.pinimg\.com\/originals\/[a-z0-9\/_-]+\.jpg/gi)];
    urls.push(...new Set(rawMatches.map(m => m[0])));
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
  await getImages('Bleach anime');
  await getImages('Attack on Titan anime');
  await getImages('Jujutsu Kaisen anime');
  await getImages('Vinland Saga anime');
  await getImages('Cowboy Bebop anime');
  await getImages('Steins Gate anime');
  await getImages('Solo Leveling anime');
}

main();
