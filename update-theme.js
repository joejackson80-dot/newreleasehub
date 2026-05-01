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

    // The current accent is mostly #00D2FF or cyan-based classes.
    // Replace hex #00D2FF with a sleek silver/chrome #E2E8F0 (slate-200) or #94A3B8 (slate-400)
    // Actually, maybe a bright metallic silver #F1F5F9 is better for accents.
    const regex1 = /#00D2FF/ig;
    if (regex1.test(content)) {
        content = content.replace(regex1, '#F1F5F9'); // slate-100 (metallic bright)
        modified = true;
    }

    // Replace rgb(0,210,255) with rgba(241,245,249)
    const regex2 = /0,210,255/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, '241,245,249');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated color theme: ${file}`);
    }
}
