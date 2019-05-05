const fs = require('fs');
const path = require('path');

const flood = require('./flood')();
const config = require('./config')();

function getPersistencePath() {
  return path.join(process.env.DATA_FOLDER, 'data.json')
}

module.exports = () => {
  function write() {
    return new Promise((resolve, reject) => {
      const data = {
        flood: flood.getState(),
        config: config.getState()
      };
      fs.writeFile(getPersistencePath(), JSON.stringify(data), { encoding: 'utf8' }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  function read() {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(getPersistencePath())) return resolve();
      fs.readFile(getPersistencePath(), { encoding: 'utf8' }, (err, rawData) => {
        if (err) return reject(err);
        const data = JSON.parse(rawData);
        flood.setState(data.flood);
        config.setState(data.config);
        resolve();
      });
    });
  }

  return {
    write,
    read,
  }
}
