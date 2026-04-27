import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const dir = './public';
const files = fs.readdirSync(dir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

async function run() {
  for (const file of files) {
    const target = path.join(dir, file);
    const size = fs.statSync(target).size;
    
    // Resize anything strictly over 800KB
    if (size > 800000) {
      console.log('Optimizing', file, '(', Math.round(size/1024/1024), 'MB )');
      
      const buffer = fs.readFileSync(target);
      let transform = sharp(buffer).resize({ width: 1400, withoutEnlargement: true });
      
      if (file.toLowerCase().endsWith('.png')) {
        transform = transform.png({ quality: 80, compressionLevel: 8 });
      } else {
        transform = transform.jpeg({ quality: 80, mozjpeg: true });
      }
      
      const outBuffer = await transform.toBuffer();
      fs.writeFileSync(target, outBuffer);
      console.log('Optimized', file, 'to', Math.round(outBuffer.length/1024), 'KB');
    }
  }
}
run();
