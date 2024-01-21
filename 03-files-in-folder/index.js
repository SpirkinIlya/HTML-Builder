const fs = require('fs');
const path = require('path');
const folderName = path.join(__dirname, 'secret-folder');
fs.readdir(folderName, (err, files) => {
  if (err) {
    console.error(err.message);
  } else {
    files.forEach((file) => {
      fs.stat(path.join(folderName, file), (err, stats) => {
        if (err) {
          console.error(err.message);
        } else {
          if (stats.isFile()) {
            const fileExtension = path.extname(file);
            const baseFileName = path.basename(file, fileExtension);
            const fileSize = stats.size / 1024;
            console.log(`${baseFileName} - ${fileExtension.slice(1)} - ${fileSize.toFixed(3)}kb`);
          }
        }
      });
    });
  }
});
