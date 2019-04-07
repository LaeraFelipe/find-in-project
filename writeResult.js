const fs = require('fs');
const path = require('path');
const escapeForRegex = require('./escapeForRegex');
const { VALUE_IDENTIFIER, FILE_IDENTIFIER, TEMPLATE_IDENTIFIER, DEFAULT_FILENAME } = require('./global-constants');

/**Template de item de resultado padrão. */
const DEFAULT_RESULT_ITEM_TEMPLATE = `${VALUE_IDENTIFIER}\n`;
/**Template de resultado padrão. */
const DEFAULT_RESULT_TEMPLATE = `${TEMPLATE_IDENTIFIER}`;

/**Formata resultado. */
function formatResult(items, customTemplate) {
  const template = customTemplate || DEFAULT_RESULT_TEMPLATE;
  return template.replace(TEMPLATE_IDENTIFIER, items);
}

/**Formata item do resultado. */
function formatResultItem(result, customTemplate) {
  const template = customTemplate || DEFAULT_RESULT_ITEM_TEMPLATE;
  return template.replace(VALUE_IDENTIFIER, result.value)
    .replace(FILE_IDENTIFIER, result.file);
}

/**Escreve resultado em arquivo. */
exports.writeResult = function (results, options) {
  const formatedResultItems = results.map(item => formatResultItem(item, options.resultItemTemplate)).join("");
  let resultToWrite = formatResult(formatedResultItems, options.resultTemplate);

  const filename = path.join(path.dirname(require.main.filename), options.resultFilename || DEFAULT_FILENAME);

  if ((options.sync === undefined || options.sync) && !process.argv.find(item => item === 'ignore-cache')) {
    try {
      let existentResult = fs.readFileSync(filename, { encoding: 'utf8' });
      if (existentResult) {
        const templateText = options.resultTemplate || DEFAULT_RESULT_TEMPLATE;

        let initTemplateText = templateText.slice(0, templateText.indexOf(TEMPLATE_IDENTIFIER));
        let endTemplateText = templateText.slice((initTemplateText.length + TEMPLATE_IDENTIFIER.length), templateText.length);

        regexToRemoveInit = new RegExp(`^${escapeForRegex(initTemplateText.trim())}`, 'g');
        regexToRemoveEnd = new RegExp(`${escapeForRegex(endTemplateText.trim())}$`, 'g');

        resultToWrite = resultToWrite.replace(regexToRemoveInit, '');
        existentResult = existentResult.replace(regexToRemoveEnd, '');

        resultToWrite = existentResult + resultToWrite;
        resultToWrite = resultToWrite.replace(/^\s*\n/gm, '')
      }
    } catch { }
  }

  fs.writeFileSync(filename, resultToWrite, { encoding: 'utf8' });
}