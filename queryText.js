const { VALUE_IDENTIFIER } = require('./constants');
const escapeForRegex = require('./escapeForRegex');

/**Regex interno. */
const INTERNAL_REGEX = '.{1,}';

/**Executa o regex e devolve resultados. */
function executeRegex(content, query) {
  const valueRegex = new RegExp(VALUE_IDENTIFIER.replace(/\$/g, '\\$'), 'g');
  let regexQuery = escapeForRegex(query);
  regexQuery = regexQuery.replace(valueRegex, `(${INTERNAL_REGEX})`);

  const regexExp = new RegExp(regexQuery, 'gm');
  let results = [];
  let regexResult;
  while ((regexResult = regexExp.exec(content)) != null) {
    if (regexResult[1]) {
      results.push(regexResult[1]);
    }
  }
  return results;
}

/**Executa consulta no texto. */
exports.queryText = function (content, query) {
  let results = [];
  if (Array.isArray(query)) {
    query.forEach(item => {

      if (item.indexOf(VALUE_IDENTIFIER) === -1) {
        throw new Error(`É necessário passar pelo menos um identificador de valor "${VALUE_IDENTIFIER}". `);
      }

      const regexResults = executeRegex(content, item);
      if (regexResults.length > 0) {
        results.push(...regexResults);
      }
    })
  } else {
    if (query.indexOf(VALUE_IDENTIFIER) === -1) {
      throw new Error(`É necessário passar pelo menos um identificador de valor "${VALUE_IDENTIFIER}". `);
    }

    const regexResults = executeRegex(content, query);
    if (regexResults.length > 0) {
      results.push(...regexResults);
    }
  }
  return results;
}
