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

    // Replace tailwind blue classes with purple
    // Matches patterns like text-blue-500, bg-blue-500/10, from-blue-700, etc.
    const blueRegex = /\bblue-(\d+)\b/g;
    if (blueRegex.test(content)) {
        content = content.replace(blueRegex, 'purple-$1');
        modified = true;
    }

    // Special case for opacity/fractions like blue-500/10
    const blueOpacityRegex = /\bblue-(\d+)\/(\d+)\b/g;
    if (blueOpacityRegex.test(content)) {
        content = content.replace(blueOpacityRegex, 'purple-$1/$2');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Replaced tailwind blue classes in: ${file}`);
    }
}
