const fs = require('fs');
const path = require('path');
const history = require('./history');
const { queryText } = require('./queryText');
const { writeResult } = require('./writeResult');
const FindInProjectConfiguration = require('./configuration');

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
      (options.sync === undefined || options.sync) ? !history.hasIn(newResult) : true) {
      results.push(newResult);
      if (options.sync === undefined || options.sync) {
        history.add(newResult);
      }
    }
  })
}

/**Loopa nos arquivos do projeto. */
function findInProject(options, filename, results = []) {
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
  const validOptions = new FindInProjectConfiguration(options);

  if (validOptions.useHistory)
    history.load(validOptions);

  const result = findInProject(validOptions, validOptions.source);
  writeResult(result, validOptions);
  history.write(validOptions);

  console.clear();
  console.log('Complete');

  setTimeout(() => {
    console.clear();
  }, 2000)
}
