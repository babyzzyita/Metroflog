// Dependencies
const fs = require('fs');
const path = require('path');

// Exported functions
module.exports = save;

function save(directory, filename, buffer) {
  return new Promise((resolve, reject) => {
    const target = path.join(directory, filename);
    fs.writeFile(target, buffer, (err) => {
      if (err) {

          console.log('What is this shit?', buffer);
          console.log('Is Buffer?', Buffer.isBuffer(buffer));
          console.log(err);
      }
      return (err) ? reject(err) : resolve(target);
    });
  });
}
