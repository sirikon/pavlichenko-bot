const fs = require('fs');
const path = require('path');

function getPersistencePath() {
  return path.join(process.env.DATA_FOLDER, 'data.json');
}

module.exports = async (state) => {
  function setState(newState) {
    Object.keys(newState)
      .forEach((key) => {
        // eslint-disable-next-line no-param-reassign
        state[key] = newState[key];
      });
  }

  function write() {
    return new Promise((resolve, reject) => {
      fs.writeFile(getPersistencePath(), JSON.stringify(state, null, 2), { encoding: 'utf8' }, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  function read() {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(getPersistencePath())) return resolve();
      return fs.readFile(getPersistencePath(), { encoding: 'utf8' }, (err, rawData) => {
        if (err) return reject(err);
        const data = JSON.parse(rawData);
        setState(data);
        return resolve();
      });
    });
  }

  setInterval(() => {
    write()
      .then(() => {}, err => console.log(err));
  }, 1 * 60 * 1000 /* One minute */);

  await read();
};
