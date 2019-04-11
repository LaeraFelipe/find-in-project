const path = require('path');
const {
  VALUE_IDENTIFIER,
  RESULT_IDENTIFIER,
  DEFAULT_FILENAME,
  DEFAULT_TEMPLATE,
  DEFAULT_ITEM_TEMPLATE,
  IGNORE_HISTORY_ARG,
  EMPTY_FIND_STATEMENT,
  NO_RESULT_IDENTIFIER,
  NO_VALUE_IDENTIFIER,
  HISTORY_DIRECTORY
} = require('./constants');

/**Classe para receber configuração. */
module.exports = class FindInProjectConfiguration {
  constructor(configuration) {
    this.validate(configuration);
    this.sync = configuration.sync === undefined ? true : configuration.sync;
    this.find = configuration.find;

    const mainDirectory = path.dirname(require.main.filename);

    this.filename = path.join(mainDirectory, configuration.filename || DEFAULT_FILENAME);

    this.historyFilename = path.join(mainDirectory, HISTORY_DIRECTORY,
      configuration.filename ?
        configuration.filename.replace(path.extname(configuration.filename), '.json')
        :
        DEFAULT_FILENAME.replace(path.extname(DEFAULT_FILENAME), '.json'));

    this.source = configuration.source ?
      path.join(mainDirectory, configuration.source)
      :
      mainDirectory;

    this.filename = configuration.filename || DEFAULT_FILENAME;
    this.template = configuration.template || DEFAULT_TEMPLATE;
    this.itemTemplate = configuration.itemTemplate || DEFAULT_ITEM_TEMPLATE;

    this.exclude = configuration.exclude;
  }

  /**Se deve usar o histórico. */
  get useHistory() {
    if (process.argv.find(arg => arg === IGNORE_HISTORY_ARG)) {
      return false;
    } else {
      return this.sync;
    }
  }

  /**Valida configuração passada. */
  validate(configuration) {
    if (!configuration.find) {
      throw new Error(EMPTY_FIND_STATEMENT);
    }

    if (Array.isArray(configuration.find)) {
      configuration.find.forEach(findStatement => {
        if (findStatement.indexOf(VALUE_IDENTIFIER) === -1) {
          throw new Error(NO_VALUE_IDENTIFIER);
        }
      })
    } else {
      if (configuration.find.indexOf(VALUE_IDENTIFIER) === -1) {
        throw new Error(NO_VALUE_IDENTIFIER);
      }
    }

    if (configuration.template && configuration.template.indexOf(RESULT_IDENTIFIER) === -1) {
      throw new Error(NO_RESULT_IDENTIFIER);
    }

    if (configuration.itemTemplate && configuration.itemTemplate.indexOf(VALUE_IDENTIFIER) === -1) {
      throw new Error(NO_VALUE_IDENTIFIER);
    }
  }
}