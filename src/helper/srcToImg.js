const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

module.exports = async (src, dir) => {
  if(/\.jpg|png|gif$/.test(src)) await urlToImg(src, dir);
  else await base64ToImg(sec, dir);
};

// url => img
const urlToImg = promisify((url, dir, callback) => {
  const mod = /^https:/.test(url) ? https : http;
  const ext = path.extname(url);
  const imgPath = path.join(dir, `${Date.now()}${ext}`);
  mod.get(url, res => {
    res.pipe(fs.createWriteStream(imgPath))
      .on('finish', () => {
        callback();
        console.info(imgPath);
      });
  });
});


// base64 => img
const base64ToImg = async (base64Str, dir) => {
  // base64:image/jpeg;base64,/.......
  const matchs = base64Str.match(/^data:(.+?);base64,(.+)$/);
  try {
    const ext = matchs[1].split('/')[1].replace('jpeg', 'jpg');
    const file = path.join(dir, `${Date.now()}.${ext}`);
    await writeFile(file, matchs[2], 'base64');
    console.info(file);
  } catch (error) {
    console.error('base64字符不合法');
  }
}