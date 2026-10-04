import https from 'https';

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
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' site:i.pinimg.com/originals')}`;
  const html = await fetchHtml(url);
  
  const matches = [...html.matchAll(/https:\/\/i\.pinimg\.com\/originals\/[a-z0-9\/]+\.jpg/g)];
  const urls = [...new Set(matches.map(m => m[0]))];
  console.log(`--- ${query} ---`);
  urls.slice(0, 5).forEach(u => console.log(u));
}

async function main() {
  await getImages('Elden Ring game');
  await getImages('Sekiro gameplay');
  await getImages('Dark Souls 3 game');
  await getImages('Bloodborne game');
  await getImages('Cyberpunk 2077 game');
  await getImages('Black Myth Wukong');
  await getImages('Bleach anime');
  await getImages('Attack on Titan anime');
  await getImages('Jujutsu Kaisen anime');
  await getImages('Vinland Saga anime');
  await getImages('Cowboy Bebop anime');
  await getImages('Steins Gate anime');
  await getImages('Solo Leveling anime');
}

main();
