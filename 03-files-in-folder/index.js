const FS = require('fs');
const PATH = require('path');

const folder = PATH.join(__dirname, 'secret-folder');

FS.readdir(folder, { withFileTypes: 'true' }, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) =>
      FS.stat(PATH.join(folder, file.name), (err, stats) => {
        if (err) console.log(err);
        else{
          if (!stats.isDirectory()) {
            console.log(
              `${file.name.split('.')[0]} - ${PATH.extname(file.name).substring(1)} - ${(
                stats.size / 1024
              ).toFixed(3)}KB`
            );
          }
        }
      })
    );
  }
});
