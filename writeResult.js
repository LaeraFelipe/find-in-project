const fs = require('fs');
const escapeForRegex = require('./escapeForRegex');
const {
  VALUE_IDENTIFIER,
  FILE_IDENTIFIER,
  RESULT_IDENTIFIER
} = require('./constants');

/**Formata resultado. */
function formatResult(items, template) {
  return template.replace(RESULT_IDENTIFIER, items);
}

/**Formata item do resultado. */
function formatItem(result, itemTemplate) {
  return itemTemplate.replace(VALUE_IDENTIFIER, result.value)
    .replace(FILE_IDENTIFIER, result.file.replace(/\\/g, '\\\\'));
}

/**Escreve resultado em arquivo. */
exports.writeResult = function (results, options) {
  const formatedResultItems = results.map(item => formatItem(item, options.itemTemplate)).join("");
  let resultToWrite = formatResult(formatedResultItems, options.template);

  if (options.useHistory) {
    try {
      let existentResult = fs.readFileSync(options.filename, { encoding: 'utf8' });
      if (existentResult) {
        let initTemplateText = options.template.slice(0, options.template.indexOf(RESULT_IDENTIFIER));
        let endTemplateText = options.template.slice((initTemplateText.length + RESULT_IDENTIFIER.length), options.template.length);

        regexToRemoveInit = new RegExp(`^${escapeForRegex(initTemplateText.trim())}`, 'g');
        regexToRemoveEnd = new RegExp(`${escapeForRegex(endTemplateText.trim())}$`, 'g');

        resultToWrite = resultToWrite.replace(regexToRemoveInit, '');
        existentResult = existentResult.replace(regexToRemoveEnd, '');

        resultToWrite = existentResult + resultToWrite;
        resultToWrite = resultToWrite.replace(/^\s*\n/gm, '')
      }
    } catch (error) { }
  }
  fs.writeFileSync(options.filename, resultToWrite, { encoding: 'utf8' });
}