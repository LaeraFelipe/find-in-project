const fs = require('fs');
const path = require('path');

let history;

/**Pega o cache atual. */
exports.load = function (options) {
  if (options.useHistory) {
    try {
      history = require(options.historyFilename);
    } catch{
      history = {}
    }
  } else {
    history = {};
    return;
  }
}

/**Adiciona resultado no cache. */
exports.add = function (result) {
  if (!history[result.value]) {
    history[result.value] = new Date();
  }
}

/**Verifica se o resulta esta no cache. */
exports.hasIn = function (result) {
  return !!history[result.value];
}

/**Cria o arquivo do cache. */
exports.write = function (options) {
  if (options.useHistory) {
    if (!fs.existsSync(path.dirname(options.historyFilename))) {
      fs.mkdirSync(path.dirname(options.historyFilename));
    }
    fs.writeFileSync(options.historyFilename, JSON.stringify(history, 0, 2), { encoding: 'utf8' });
  }
}

