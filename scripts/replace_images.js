const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace avatar/people URLs with default-avatar.png
      content = content.replace(/https:\/\/images\.unsplash\.com\/photo-(?:1493225457124|1577375729152|1516280440614|1506157786151|1508700115892|1598488035139|1501386761578|1524368535928)[^'"\`]+/g, '/images/default-avatar.png');
      
      // Replace cover art URLs with default-cover.png
      content = content.replace(/https:\/\/images\.unsplash\.com\/photo-(?:1614613535308|1493225255756|1459749411177|1514525253361|1470225620780|1511671782779)[^'"\`]+/g, '/images/default-cover.png');
      
      // Replace any remaining unsplash URLs with default-cover.png generically
      content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+[^'"\`]+/g, '/images/default-cover.png');

      // Also there is one specific gradient background using unsplash in customize page, we can leave it or replace it. Let's let the generic regex catch it.

      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('apps/web/src');
console.log('Replaced unsplash URLs with local defaults.');
