const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
stdout.write('Hello! Write your text, text will be written in output.txt.\n');
stdout.write('To exit the programm type exit or press Ctrl+C\n');
const writableStream = fs.createWriteStream(path.join(__dirname, 'output.txt'));
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writableStream.write(data);
  }
});
process.on('exit', () => {
  stdout.write('Program stop!');
});
process.on('SIGINT', () => {
  process.exit();
});
