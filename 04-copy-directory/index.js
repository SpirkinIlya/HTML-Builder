const fs = require('fs');
const path = require('path');
fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    console.error(err.message);
  }
});
fs.readdir(path.join(__dirname, 'files'), (err, files) => {
  if (err) {
    console.error(err.message);
  }
  files.forEach((file) => {
    const fileToCopyPath = path.join(__dirname, 'files', file);
    const copyOfFilePath = path.join(__dirname, 'files-copy', file);
    fs.copyFile(fileToCopyPath, copyOfFilePath, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });
});
