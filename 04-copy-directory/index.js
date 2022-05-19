const FS = require("fs");
const PATH = require("path");

const FOLDER = PATH.join(__dirname, "files");
const FOLDER_COPY = PATH.join(__dirname, "files-copy");

FS.mkdir(FOLDER_COPY, { recursive: true }, (err) => {
  if (err) return console.log('Создание папки прошло успешно');
});

FS.readdir(FOLDER, { withFileTypes: "true" }, (err, files) => {
  if (err) return console.log(err);
  files.forEach((file) => {
    FS.copyFile(
      PATH.join(__dirname, "files", file.name),
      PATH.join(__dirname, "files-copy", file.name),
      (err) => {
        if (err) return console.log(err);
      }
    );
  });
});
