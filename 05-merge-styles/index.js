const FS = require('fs');
const PATH = require('path');

const STYLES = PATH.join(__dirname, 'styles');
const DIST = PATH.join(__dirname, 'project-dist');

FS.promises
  .readdir(STYLES, { withFileTypes: true })
  .then((files) => {
    let filePaths = [];
    files.forEach((file) => {
      if (PATH.extname(file.name) === '.css') {
        filePaths.push(PATH.join(STYLES, file.name));
      }
    });
    const PROMISES = filePaths.map((path) => {
      return new Promise((resolve) => {
        let STYLE = '';
        return FS.createReadStream(path)
          .on('data', (data) => {
            STYLE += data;
          })
          .on('end', () => {
            resolve(STYLE);
          });
      });
    });
    return Promise.all(PROMISES);
  })
  .then((results) => {
    const RESULT_CSS = FS.createWriteStream(PATH.join(DIST, 'bundle.css'));
    results.forEach((result) => {
      RESULT_CSS.write(result);
    });
  });
