import fs from 'fs';
import https from 'https';
import path from 'path';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const outDir = path.join(process.cwd(), 'public', 'img', 'icons');

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const dest = path.join(outDir, filename);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, filename).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
  });
}

async function main() {
  // Official-looking macOS Big Sur style Spotify icon
  await downloadImage('https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHj65Ww30SQTq/1255e2d6bde03ec0ad0bf3e93a7eb7ec_Vl1uIokX2e.png', 'spotify.png');
  // Official-looking macOS Big Sur style YouTube icon
  await downloadImage('https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvzkPMEqKYHj65Ww30SQTq/57cbf89150bb6a8553d10014022ee7ce_gO40sT7Ym9.png', 'youtube.png');
  console.log('Icons downloaded.');
}
main();
