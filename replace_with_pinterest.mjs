import fs from 'fs';
import path from 'path';

const pUrls = [
  "https://i.pinimg.com/originals/e6/42/e9/e642e9496e7b403f760c840dfee7a52d.jpg",
  "https://i.pinimg.com/originals/6b/c1/5a/6bc15a70d27c6d80baa0d00e3d308908.jpg",
  "https://i.pinimg.com/originals/bc/ff/a0/bcffa02869a6db71e683069ba99820f7.jpg",
  "https://i.pinimg.com/originals/73/01/95/730195655c7df1d95e96173b4443f193.png",
  "https://i.pinimg.com/originals/7b/1b/7c/7b1b7c58ecede1d73e5e8c28aff4f241.jpg",
  "https://i.pinimg.com/originals/55/02/a1/5502a165f942e860b43ec9df128c3a24.jpg",
  "https://i.pinimg.com/originals/ec/88/e4/ec88e4e95cdc87b91483173f93b35b2d.jpg",
  "https://i.pinimg.com/originals/fa/3b/16/fa3b160d9d9aa58836fec0ece29dd17f.jpg",
  "https://i.pinimg.com/originals/a2/7e/ef/a27eeffb89a5ea309b0e8a2fa5dc10a1.jpg",
  "https://i.pinimg.com/originals/ce/15/bd/ce15bd6264ff7cbd48dd6172ba5be5b2.jpg",
  "https://i.pinimg.com/originals/3b/3d/ee/3b3dee8d066c5fb83f2a912235449ea5.jpg",
  "https://i.pinimg.com/originals/79/62/ca/7962cadd526ce9b3f88e8ed4c07edacc.jpg",
  "https://i.pinimg.com/originals/29/a0/f7/29a0f751a2ba8e2028bb0580750ff0c9.jpg",
  "https://i.pinimg.com/originals/43/d6/e0/43d6e0490cf30fb4fdad6028168f663f.jpg",
  "https://i.pinimg.com/originals/d8/51/ac/d851ac8d3551044a2cc0411305f3e8e2.jpg"
];

let urlIndex = 0;
function getPUrl() {
  const url = pUrls[urlIndex % pUrls.length];
  urlIndex++;
  return url;
}

const files = [
  path.join(process.cwd(), 'src', 'data', 'games.ts'),
  path.join(process.cwd(), 'src', 'data', 'anime.ts'),
  path.join(process.cwd(), 'src', 'data', 'reels.ts')
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/"\/img\/media\/[^"]+"/g, () => `"${getPUrl()}"`);
  // Just in case there are any remaining unsplash or steam urls, replace them too
  content = content.replace(/"https:\/\/images\.unsplash\.com\/[^"]+"/g, () => `"${getPUrl()}"`);
  content = content.replace(/"https:\/\/shared\.akamai\.steamstatic\.com\/[^"]+"/g, () => `"${getPUrl()}"`);
  content = content.replace(/"https:\/\/s4\.anilist\.co\/[^"]+"/g, () => `"${getPUrl()}"`);
  fs.writeFileSync(file, content);
}

console.log('Replaced all images with Pinterest links!');
