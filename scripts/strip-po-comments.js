/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../.linguirc')));

glob(path.join(__dirname, '../', config.localeDir, '/**/*.po'), (err, files) => {
  for (const file of files) {
    const content = fs.readFileSync(file, { encoding: 'utf-8' });
    const newContent = content
      .replace(/^#.*$/mg, '')
      .replace(/(\r?\n|\r){2,}/g, '\n\n');
    fs.writeFileSync(file, newContent, { encoding: 'utf-8' });
  }
});
