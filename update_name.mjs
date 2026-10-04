import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function updateNameInFile(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.html') || filePath.endsWith('.json')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = content
      .replace(/Aditya Dhir/g, 'Aditya Salunkhe')
      .replace(/Aditya_Dhir/g, 'Aditya_Salunkhe')
      .replace(/adityadhir/g, 'adityasalunkhe');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
}

walk(path.join(process.cwd(), 'src'), updateNameInFile);
updateNameInFile(path.join(process.cwd(), 'index.html'));
console.log("Name update complete.");
