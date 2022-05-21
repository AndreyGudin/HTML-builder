const FS = require('fs');
const PATH = require('path');

const FOLDER = PATH.join(__dirname, 'files');
const FOLDER_COPY = PATH.join(__dirname, 'files-copy');

FS.promises
  .access(FOLDER_COPY, FS.constants.F_OK)
  .then(() => {
    return FS.promises.rm(FOLDER_COPY, { force: true, recursive: true });
  })
  .then(() => {
    return FS.promises.mkdir(FOLDER_COPY, { recursive: true });
  })
  .catch(() => {
    return FS.promises.mkdir(FOLDER_COPY);
  })
  .then(() => {
    return FS.readdir(FOLDER, { withFileTypes: 'true' }, (err, files) => {
      files.forEach((file) => {
        FS.copyFile(
          PATH.join(__dirname, 'files', file.name),
          PATH.join(__dirname, 'files-copy', file.name),
          (err) => {
            if (err) return console.log(err);
          }
        );
      });
    });
  });