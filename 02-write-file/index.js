const FS = require('fs') ;
const PATH = require('path');
const {stdout}  = process;
const readline = require('readline');

let inputToFile = FS.createWriteStream(PATH.join(__dirname,'text.txt'),'utf-8');

const r1 = readline.createInterface({
  input:process.stdin,
  output:inputToFile
});
stdout.write('Введите текст:\n');
r1.on('line',(line)=>{
  if (line==='exit') {r1.close();process.exit();}
  stdout.write('Введите текст:\n');
  inputToFile.write(line);
});
r1.on('close',()=>{
  console.log('Программа завершена');
});