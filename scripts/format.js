const argv = require('yargs').argv;
const path = require('path');
const fs = require('fs');

exports.format = (messages) => {
  const results = {};
  for (const [id, message] of Object.entries(messages)) {
    results[id] = message;
  }
  return results;
};

exports.compile = (messages) => {
  const result = {};
  const isTransExisted = fs.existsSync(path.resolve(argv['out-file']));

  for (const [key, message] of Object.entries(messages)) {
    if (isTransExisted) {
      const oldTrans = require(path.resolve(argv['out-file']));
      if (oldTrans[key]) {
        result[key] = oldTrans[key];
      } else {
        result[key] = message.defaultMessage;
      }
    } else {
      result[key] = message.defaultMessage;
    }
  }

  return result;
};
