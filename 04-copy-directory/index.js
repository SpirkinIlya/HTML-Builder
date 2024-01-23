const fs = require('fs');
const path = require('path');
const EventEmmiter = require('events');

const emmiter = new EventEmmiter();

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) {
    console.error(err.message);
  }
});
fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
  if (err) {
    console.error(err.message);
  }
  if (!files.length) {
    emmiter.emit('readyForCopy');
  }
  files.forEach((file, index) => {
    fs.rm(path.join(__dirname, 'files-copy', file), (err) => {
      if (err) {
        console.error(err.message);
      } else {
        if (index === files.length - 1) {
          emmiter.emit('readyForCopy');
        }
      }
    });
  });
});
emmiter.on('readyForCopy', () => {
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
});
