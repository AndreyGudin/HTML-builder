const FS = require('fs') ;
const PATH = require('path');
const { stdin, stdout } = process;
const readline = require('readline');

const input = FS.createWriteStream(PATH.join(__dirname,'text.txt'),'utf-8');
const output = FS.createReadStream(PATH.join(__dirname,'text.txt'),'utf-8');

const r1 = readline.createInterface({
  input:process.stdin,
  output:process.stdout
})

r1.on("line",(line)=>{
  console.log(line);
  if (line==='exit') r1.close();

})
r1.on("close",()=>{
  console.log('Bye');
})