const fs = require('fs');
const path = require('path');

/**Pasta do cache. */
const CACHE_DIRECTORY = 'pf_cache';

let filename;
let cache;

/**Pega o cache atual. */
exports.loadCache = function (requestedFilename) {
  const cacheFilename = requestedFilename.replace(path.extname(requestedFilename), '');
  filename = `${CACHE_DIRECTORY}/${cacheFilename}.json`;
  filename = path.join(path.dirname(require.main.filename), filename);

  if (process.argv.find(item => item === 'ignore-cache')) {
    cache = {};
    return;
  }

  if (cache)
    return cache;
  else {
    try {
      cache = require(filename);
    } catch{
      cache = {}
    }
  }
}

/**Adiciona resultado no cache. */
exports.addToCache = function (result) {
  if (!cache[result.value]) {
    cache[result.value] = new Date();
  }
}

/**Verifica se o resulta esta no cache. */
exports.hasInCache = function (result) {
  return !!cache[result.value];
}

/**Cria o arquivo do cache. */
exports.writeCache = function () {
  if (!fs.existsSync(path.dirname(filename))) {
    fs.mkdirSync(path.dirname(filename));
  }
  fs.writeFileSync(filename, JSON.stringify(cache,0,2), { encoding: 'utf8' });
}

