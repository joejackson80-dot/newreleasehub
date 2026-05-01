const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'apps', 'web', 'src');

function walkDir(dir) {
    let files = [];
    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            files = files.concat(walkDir(fullPath));
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            files.push(fullPath);
        }
    }
    return files;
}

const files = walkDir(srcDir);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // We want to replace >N</Link> where it's the site logo.
    // The logo links usually have `bg-white` and `text-black` or similar, we want to make the background transparent.
    
    // Regex to match Link with logo N
    const regex = /(<Link[^>]*href="\/"[^>]*className="[^"]*)bg-white([^"]*text-black[^"]*)(">)(N)(<\/Link>)/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, (match, p1, p2, p3, p4, p5) => {
            // Replace bg-white with bg-transparent
            return `${p1}bg-transparent${p2}${p3}<img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" />${p5}`;
        });
        modified = true;
    }
    
    // Some might not have bg-white exactly, let's also catch any >N</Link> where className has rounded
    const regex2 = /(<Link[^>]*href="\/"[^>]*className="[^"]*rounded[^"]*)(">)(N)(<\/Link>)/g;
    if (regex2.test(content)) {
        content = content.replace(regex2, (match, p1, p2, p3, p4) => {
            // make sure we remove bg-white if it's there
            let newClasses = p1.replace('bg-white', 'bg-transparent').replace('text-black', '');
            return `${newClasses}${p2}<img src="/images/nrh-logo.png" alt="NRH Logo" className="w-full h-full object-contain" />${p4}`;
        });
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated: ${file}`);
    }
}
