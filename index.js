const fs = require('fs');
const path = require('path');
const cache = require('./cache');
const { queryText } = require('./queryText');
const { writeResult } = require('./writeResult');
const { DEFAULT_FILENAME } = require('./global-constants');

/**Busca valores nos arquivos do projeto. */
function findInFile(filename, query) {
  const content = fs.readFileSync(filename, { encoding: 'utf8' });
  return queryText(content, query);
}

/**Verifica se caminho não deve ser verificado. */
function isExcluded(filename, options) {
  if (options.exclude) {
    for (const excludeItem of options.exclude) {
      if (filename.indexOf(excludeItem) > -1) {
        return true;
      }
    }
  }
  return false;
}

/**Adiciona resultado. */
function addResults(newResults, results, options) {
  newResults.forEach(newResult => {
    if (!results.find(existentResult => existentResult.value === newResult.value) &&
      (options.sync === undefined || options.sync) ? !cache.hasInCache(newResult) : true) {
      results.push(newResult);
      if (options.sync === undefined || options.sync) {
        cache.addToCache(newResult);
      }
    }
  })
}

/**Loopa nos arquivos do projeto. */
function findInProject(options, filename = path.dirname(require.main.filename), results = []) {
  const files = fs.readdirSync(filename);
  for (const internalFilename of files) {
    const fullPath = path.join(filename, internalFilename);
    if (!isExcluded(fullPath, options)) {
      console.log('Scanning file: ', fullPath);
      if (fs.lstatSync(fullPath).isDirectory()) {
        findInProject(options, fullPath, results);
      } else {
        addResults
          (
            findInFile(fullPath, options.find).map(item => ({ value: item, file: fullPath })),
            results,
            options
          );
      }
    }
  }
  return results;
}

module.exports = function (options) {
  if (options.sync === undefined || options.sync) {
    cache.loadCache(options.filename || DEFAULT_FILENAME);
  }

  const result = findInProject(options);
  writeResult(result, options);

  if (options.sync === undefined || options.sync)
    cache.writeCache();

  console.clear();
  console.log('Complete');

  setTimeout(() => {
    console.clear();
  }, 2000)
}
