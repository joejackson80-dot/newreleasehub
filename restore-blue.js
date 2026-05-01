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

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Change #F1F5F9 (Silver) back to #00D2FF (Cyan) for accents
    // I only want to replace it where it's used as an accent/glow, 
    // but a global replace of what I just did is probably what the user wants to revert.
    const regex1 = /#F1F5F9/ig;
    if (regex1.test(content)) {
        content = content.replace(regex1, '#00D2FF');
        modified = true;
    }

    // Change 241,245,249 (Silver RGB) back to 0,210,255 (Cyan RGB)
    const regex2 = /241,245,249/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, '0,210,255');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Restored Blue/Cyan accent: ${file}`);
    }
}
