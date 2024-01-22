const fs = require('fs');
const path = require('path');
const EventEmmiter = require('events');
const emmiter = new EventEmmiter();
//create project folder
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) {
    console.error(err.message);
  }
});
//merge styles in one file
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
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
//create index.html from templates
let inputHTMLTemplate = '';

const readableSteram = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
readableSteram.on('data', (chunk) => (inputHTMLTemplate += chunk));
readableSteram.on('end', () => {
  emmiter.emit('getInitialTemplate');
  readableSteram.close();
});

emmiter.on('getInitialTemplate', () => {
  const regExp = /\{\{(\w*)\}\}/gm;
  let componentMatches = inputHTMLTemplate.match(regExp);
  const componentMatchesSet = new Set(componentMatches);
  componentMatches = Array.from(componentMatchesSet);
  componentMatches.forEach((template, index) => {
    const fileComponent = path.join(
      __dirname,
      'components',
      template.slice(2, template.length - 2) + '.html',
    );
    let data = '';
    const readableSteram = fs.createReadStream(fileComponent, 'utf-8');
    readableSteram.on('data', (chunk) => (data += chunk));
    readableSteram.on('end', () => {
      readableSteram.close();
      inputHTMLTemplate = inputHTMLTemplate.replace(template, data);
      if (index === (componentMatches.length - 1)) {
        emmiter.emit('newContentReady');
      }
    });
  });
});

emmiter.on('newContentReady', () => {
  const writableSream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'index.html'),
  );
  writableSream.write(inputHTMLTemplate);
});

//copy assets
fs.mkdir(
  path.join(__dirname, 'project-dist', 'assets'),
  { recursive: true },
  (err) => {
    if (err) {
      console.error(err.message);
    }
  },
);

copyFolder(
  path.join(__dirname, 'assets'),
  path.join(__dirname, 'project-dist', 'assets'),
);

function copyFolder(folderToCopy, folderWhereCopy) {
  fs.readdir(folderToCopy, (err, files) => {
    if (err) {
      console.error(err.message);
    } else {
      files.forEach((file) => {
        fs.stat(path.join(folderToCopy, file), (err, stats) => {
          if (err) {
            console.error(err.message);
          } else {
            if (stats.isFile()) {
              fs.copyFile(
                path.join(folderToCopy, file),
                path.join(folderWhereCopy, file),
                (err) => {
                  if (err) {
                    console.error(err.message);
                  }
                },
              );
            }
            if (stats.isDirectory()) {
              const newFolder = path.join(folderWhereCopy, file);
              const redingFolder = path.join(folderToCopy, file);
              fs.mkdir(newFolder, { recursive: true }, (err) => {
                if (err) {
                  console.error(err.message);
                }
              });
              copyFolder(redingFolder, newFolder);
            }
          }
        });
      });
    }
  });
}
