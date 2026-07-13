// NOTE: legacy-nursery.html is now maintained directly (not assembled from parts)
// because the GIS module integration makes the part-file approach impractical.
// The part files (part1.txt - part7.txt) are kept for reference only.
//
// If you need to rebuild from parts, run:
//   node map.js --rebuild
//
// Normal builds skip this step — Vite uses legacy-nursery.html directly.

import fs from 'fs';

if (process.argv.includes('--rebuild')) {
  const p1 = fs.readFileSync('public/part1.txt', 'utf8');
  const p2 = fs.readFileSync('public/part2.txt', 'utf8');
  const p3 = fs.readFileSync('public/part3.txt', 'utf8');
  const p4 = fs.readFileSync('public/part4.txt', 'utf8');
  const p5 = fs.readFileSync('public/part5.txt', 'utf8');
  const p6 = fs.readFileSync('public/part6.txt', 'utf8');
  const p7 = fs.readFileSync('public/part7.txt', 'utf8');
  fs.writeFileSync('public/legacy-nursery.html', p1 + p2 + p3 + p4 + p5 + p6 + p7);
  console.log('Rebuilt legacy-nursery.html from parts.');
} else {
  console.log('Skipping part assembly — legacy-nursery.html is maintained directly.');
}