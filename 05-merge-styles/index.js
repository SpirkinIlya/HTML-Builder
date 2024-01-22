const fs = require('fs');
const path = require('path');
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);
fs.readdir(path.join(__dirname, 'styles'), (err, files) => {
  if (err) {
    console.error(err.message);
  } else {
    files.forEach((file) => {
      fs.stat(path.join(__dirname, 'styles', file), (err, stats) => {
        const fileExtension = path.extname(file);
        if (stats.isFile() && fileExtension === '.css') {
          const readableStream = fs.createReadStream(
            path.join(__dirname, 'styles', file),
            'utf-8',
          );
          readableStream.on('data', (chunk) => {
            writableStream.write(chunk);
          });
        }
      });
    });
  }
});
