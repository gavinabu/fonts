import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import http from 'node:http';
import https from 'node:https';

const dir = process.cwd();

const app = express();

function getCSS(filename:string) {
  const italic:boolean = filename.split("-").length > 1 && filename.split("-")[1].split(".")[0] === 'italic';
  return `
  @font-face {
    font-family: '${filename.split("-")[0].split(".")[0].split("_").join(" ")}';
    font-style: ${italic ? 'italic' : 'normal'};
    font-weight: 100-900;
    font-display: swap;
    src: url(https://fonts.justwhatever.net/font/${filename}) format('woff2');
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }`
}

app.use(express.static(path.join(dir, 'public')));

app.get('/fonts.css', (req, res) => {
  res.type('text/css');
  res.send(`/* JustWhatever Font Manager */\n${fs.readdirSync(path.join(dir, 'public', "font")).filter(e => e.endsWith('.woff2')).map(e => getCSS(e)).join('\n')}`);
});


app.use((req, res) => {
  res.json({error:404, message:'Endpoint not found'});
});
app.listen(fs.existsSync(path.join(dir, 'DEV')) ? 3000 : 80, () => {
  console.log(`Server started on port ${fs.existsSync(path.join(dir, 'DEV')) ? 3000 : 80}`)
});