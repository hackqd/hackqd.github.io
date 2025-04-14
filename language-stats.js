const fs = require('fs');
const path = require('path');

// File extensions we care about
const languageMap = {
    '.html': 'HTML',
    '.css': 'CSS',
    '.js': 'JavaScript'
};

// Store sizes per language
const languageSizes = {
    HTML: 0,
    CSS: 0,
    JavaScript: 0
};

// Recursively scan folder and accumulate file sizes
function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            scanDir(fullPath);
        } else {
            const ext = path.extname(file);
            const lang = languageMap[ext];
            if (lang) {
                languageSizes[lang] += stat.size;
            }
        }
    }
}

// Calculate percentages
function calculatePercentages(sizes) {
    const total = Object.values(sizes).reduce((a, b) => a + b, 0);
    const percentages = {};
    for (const lang in sizes) {
        percentages[lang] = total === 0 ? 0 : ((sizes[lang] / total) * 100).toFixed(1);
    }
    return percentages;
}

// Run
scanDir('./'); // scan current project folder
const percentages = calculatePercentages(languageSizes);
console.log('Language usage:');
console.log(percentages);

// Optional: generate a JSON or HTML snippet
fs.writeFileSync('language-data.json', JSON.stringify(percentages, null, 2));
