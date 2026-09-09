import fs from 'fs';

const p1 = fs.readFileSync('public/part1.txt', 'utf8');
const p2 = fs.readFileSync('public/part2.txt', 'utf8');
const p3 = fs.readFileSync('public/part3.txt', 'utf8');
const p4 = fs.readFileSync('public/part4.txt', 'utf8');
const p5 = fs.readFileSync('public/part5.txt', 'utf8');
const p6 = fs.readFileSync('public/part6.txt', 'utf8');
const p7 = fs.readFileSync('public/part7.txt', 'utf8');

// NOTE: this writes to public/legacy/plantation.html because that is the
// file Vercel actually serves (see vercel.json redirect "/" ->
// "/legacy/plantation.html"). public/plantation.html is NOT served by
// anything -- writing there let this file and the real production file
// silently drift apart for a long time. Always edit the part*.txt files,
// then run `node map.js`, then commit BOTH the part files and the
// regenerated public/legacy/plantation.html together.
fs.writeFileSync('public/legacy/plantation.html', p1 + p2 + p3 + p4 + p5 + p6 + p7);
console.log('Done mapping -> public/legacy/plantation.html');
