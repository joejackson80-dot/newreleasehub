const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'web', 'src');

function walkDir(dir) {
    let files = [];
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = walkDir(srcDir);

// Premium Purple Palette
const PURPLE_HEX = '#A855F7';
const PURPLE_RGB = '168, 85, 247';

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Change Cyan (#00D2FF) to Purple
    const regex1 = /#00D2FF/ig;
    if (regex1.test(content)) {
        content = content.replace(regex1, PURPLE_HEX);
        modified = true;
    }

    // Change Cyan RGB (0,210,255) to Purple RGB
    const regex2 = /0,210,255/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, PURPLE_RGB);
        modified = true;
    }

    // Also look for other cyan variations if any
    const regex3 = /#00c2ff/ig;
    if (regex3.test(content)) {
        content = content.replace(regex3, PURPLE_HEX);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated to Purple: ${file}`);
    }
}
