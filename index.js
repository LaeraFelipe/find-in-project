const fs = require('fs');
const path = require('path');
const cache = require('./cache');
const { queryText } = require('./queryText');
const { writeResult } = require('./writeResult');

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
    if (!results.find(existentResult => existentResult.value === newResult.value) && !cache.hasInCache(newResult)) {
      results.push(newResult);
      cache.addToCache(newResult);
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
  console.log('Runing')
  cache.loadCache(options.filename || "result.txt");
  const result = findInProject(options);
  writeResult(result, options);
  cache.writeCache();
  console.clear();
  console.log('Complete')
}
