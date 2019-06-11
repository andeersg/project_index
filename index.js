const fs = require('fs');
const path = require('path');
const colors = require('colors');
const moment = require('moment');
const pkg = require('./package.json');
const Db = require('./db');
const printTable = require('./table');

const indexRoot = '/Users/anders.grendstadbakk/Projects';
const db = new Db();

const ignoreItems = [
  '.git',
  'node_modules',
  '.svn',
  '.DS_Store',
  'vendor',
  'lib',
];

console.log(`Project Indexer - ${colors.green(pkg.version)}`);

console.log('');

const filterFolders = (item) => {
  return ignoreItems.indexOf(item) < 0;
};

const hasGit = (src) => {
  return new Promise((resolve, reject) => {
    fs.access(`${src}/.git`, (err) => {
      if (err) return resolve(false);
      resolve(true);
    });
  });
};

/**
 * Lists content of folder.
 * 
 * @param {string} dir 
 * @param {boolean} foldersOnly 
 */
const listContent = (dir, foldersOnly = true) => {
  return new Promise(function(resolve, reject) {
    fs.readdir(dir, { withFileTypes: true }, function(err, files) {
      if (err) return reject(err);

      if (foldersOnly) {
        files = files.filter(item => item.isDirectory());
      }

      files = files.filter(filterFolders);

      resolve(files);
    });
  });
};

const getFolderInfo = async (src, category) => {
  const gitStatus = await hasGit(src);

  return new Promise((resolve, reject) => {
    fs.lstat(src, (err, info) => {
      if (err) return reject(err);

      const pathInfo = path.parse(src);

      resolve({
        name: pathInfo.name,
        path: src,
        category: category,
        git: gitStatus,
        ...info,
      });
    });
  });
}

const printStatus = () => {
  const data = db.getData();

  const rows = data.map(item => {
    const row = {
      Name: item.name,
      Category: item.category,
      Modified: moment(item.mtimeMs).format('DD.MM.YY'),
      Git: item.git ? 'Yes' : 'No',
    };

    return row;
  });

  printTable(rows);
};

(async () => {
  const categories = await listContent(indexRoot, true);
  for (let i = 0; i < categories.length; i++) { // categories.length
    const projects = await listContent(`${indexRoot}/${categories[i].name}`, true);
    for (let j = 0; j < projects.length; j++) {
      const info = await getFolderInfo(`${indexRoot}/${categories[i].name}/${projects[j].name}`, categories[i].name);
      db.add(`${categories[i].name}-${info.name}`, info);
      
    }
  }

  printStatus();
})();
