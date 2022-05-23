const FS = require('fs');
const PATH = require('path');

const COMPONENTS = PATH.join(__dirname, 'components');
const ASSETS = PATH.join(__dirname, 'assets');
const STYLES = PATH.join(__dirname, 'styles');
const DIST = PATH.join(__dirname, 'project-dist');
const TEMPLATE_FILE = PATH.join(__dirname, 'template.html');
const INDEX_FILE = PATH.join(DIST, 'index.html');
const STYLE_FILE = PATH.join(DIST, 'style.css');

async function readComponentsHTML() {
  const FILES = await FS.promises.readdir(COMPONENTS, { withFileTypes: true });
  let filePaths = [];
  FILES.forEach((file) => {
    if (PATH.extname(file.name) === '.html') {
      let key = file.name.split('.')[0];
      let value = PATH.join(COMPONENTS, file.name);
      filePaths.push({ name: key, path: value });
    }
  });
  const PROMISES = filePaths.map((path) => {
    return new Promise((resolve) => {
      let COMPONENT = '';
      return FS.createReadStream(path.path)
        .on('data', (chunk) => {
          COMPONENT += chunk;
        })
        .on('end', () => {
          resolve({ name: path.name, html: COMPONENT });
        });
    });
  });
  return Promise.all(PROMISES);
}
async function createIndex(pathToIndex) {
  const COMPONENTS_HTML = await readComponentsHTML();
  let TEMPLATE_HTML = await new Promise((resolve) => {
    let data = '';
    FS.createReadStream(TEMPLATE_FILE)
      .on('data', (chunk) => {
        data += chunk;
      })
      .on('end', () => resolve(data));
  });
  COMPONENTS_HTML.forEach((comp) => {
    let regString =`{{${comp.name}}}`;
    let reg = new RegExp(regString,'g');
    TEMPLATE_HTML = TEMPLATE_HTML.replace(reg, comp.html);
  });
  return await FS.promises.mkdir(DIST, { recursive: true }).then(() => {
    FS.createWriteStream(pathToIndex).write(TEMPLATE_HTML);
  });
}
async function copyFiles(folderName){
  const ASSETS_FOLDER = PATH.join(ASSETS,folderName);
  const ASSETS_DIST_FOLDER = PATH.join(DIST,'assets',folderName);
  const FILES = await FS.promises.readdir(ASSETS_FOLDER,{withFileTypes:true});
  for(let i=0;i<FILES.length;i++){
    await FS.promises.copyFile(
      PATH.join(ASSETS_FOLDER, FILES[i].name),
      PATH.join(ASSETS_DIST_FOLDER, FILES[i].name)
    );
  }
}

async function deleteFiles(folderName) {
  const ASSETS_DIST_FOLDER = PATH.join(DIST,'assets',folderName);
  const FILES = await FS.promises.readdir(ASSETS_DIST_FOLDER,{withFileTypes:true});
  for (let i = 0; i < FILES.length; i++) {
    await FS.promises.rm(PATH.join(ASSETS_DIST_FOLDER,FILES[i].name), {
      force: true,
      recursive: true,
    });
  }
}

async function copyAssets() {
  try {
    await FS.promises.access(PATH.join(DIST,'assets'));
    await deleteFiles('fonts');
    await deleteFiles('img');
    await deleteFiles('svg');
  } catch (error) {
    await FS.promises.mkdir(PATH.join(DIST,'assets'), { recursive: true });
    await FS.promises.mkdir(PATH.join(DIST,'assets','fonts'), { recursive: true });
    await FS.promises.mkdir(PATH.join(DIST,'assets','img'), { recursive: true });
    await FS.promises.mkdir(PATH.join(DIST,'assets','svg'), { recursive: true });
  }
  const FILES_ASSETS = await FS.promises.readdir(ASSETS);
  for(let i=0;i<FILES_ASSETS.length;i++){
    await copyFiles(FILES_ASSETS[i]);
  }
}
async function mergeStyles() {
  const FILES = await FS.promises.readdir(STYLES, { withFileTypes: true });
  let filePaths = [];
  FILES.forEach((file) => {
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
  const PROMISES_CSS = await Promise.all(PROMISES);
  const RESULT_CSS = FS.createWriteStream(STYLE_FILE);
  PROMISES_CSS.forEach((result) => {
    RESULT_CSS.write(result);
  });
}

createIndex(INDEX_FILE).then(()=>{mergeStyles();}).then(()=>{copyAssets();});

