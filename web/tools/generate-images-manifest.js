#!/usr/bin/env node
// generate-images-manifest.js
// Scans web/images/scrollingImages and writes images.json (array of filenames)

const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'images', 'scrollingImages');
const outFile = path.join(imagesDir, 'images.json');

fs.readdir(imagesDir, (err, files) => {
  if(err){
    console.error('Failed to read images directory', err);
    process.exit(1);
  }
  const imgs = files.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.png','.jpg','.jpeg','.webp','.gif','.svg'].includes(ext) && f !== 'images.json';
  });
  imgs.sort();
  fs.writeFile(outFile, JSON.stringify(imgs, null, 2), (err) => {
    if(err) return console.error('Failed to write manifest', err);
    console.log('Wrote', outFile);
  });
});
