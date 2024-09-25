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
  return `@font-face {
  font-family: '${filename.split("-")[0].split(".")[0].split("_").join(" ")}';
  font-style: ${italic ? 'italic' : 'normal'};
  font-weight: 100-900;
  src: url(https://fonts.justwhatever.net/font/${filename}) format('woff2');
}`
}

app.use(express.static(path.join(dir, 'public')));

app.get('/', (req, res) => {
  res.type('text/css');
  res.send(`${fs.readdirSync(path.join(dir, 'public', "font")).filter(e => e.endsWith('.woff2')).map(e => getCSS(e)).join('\n')}`);
});


app.use((req, res) => {
  res.json({error:404, message:'Endpoint not found'});
});
app.listen(fs.existsSync(path.join(dir, 'DEV')) ? 3000 : 80, () => {
  console.log(`Server started on port ${fs.existsSync(path.join(dir, 'DEV')) ? 3000 : 80}`)
});