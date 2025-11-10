const fs = require('fs');
const path = require('path');

// Create output directory
const outputDir = '.vercel/output/static';
fs.mkdirSync(outputDir, { recursive: true });

// Copy static files
const filesToCopy = ['index.html', '_headers', '_routes.json'];

filesToCopy.forEach(file => {
  if (fs.existsSync(file)) {
    fs.copyFileSync(file, path.join(outputDir, file));
    console.log(`Copied ${file}`);
  }
});

console.log('Build complete!');

