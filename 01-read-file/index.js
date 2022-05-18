const FS = require('fs') ;
const PATH = require('path');
const { stdin, stdout } = process;

const stream = FS.createReadStream(PATH.join(__dirname,'text.txt'));
let data = '';
stream.on('data',chunk => data+=chunk);
stream.on('end',()=>stdout.write(data));