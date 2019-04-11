//IDENTIFIERS
const VALUE_IDENTIFIER = '%value%';
const FILE_IDENTIFIER = '%file%';
const RESULT_IDENTIFIER = '%result%';

//DEFAULT OPTIONS
const DEFAULT_FILENAME = 'result.txt';
const DEFAULT_ITEM_TEMPLATE = `${VALUE_IDENTIFIER} - ${FILE_IDENTIFIER}\n'`;
const DEFAULT_TEMPLATE = `${RESULT_IDENTIFIER}`;

//ERROR MESSAGES
const EMPTY_FIND_STATEMENT = 'You need to pass a values ​​search setting.';
const NO_VALUE_IDENTIFIER = 'You need to pass the "%value%" identifier in the value search configuration.';
const NO_RESULT_IDENTIFIER = 'You need to pass the "%result%" identifier in the template configuration.';

//COMMAND ARGS
const IGNORE_HISTORY_ARG = 'ignore-history';

//CONFIGURATIONS
const HISTORY_DIRECTORY = 'fip-history';

module.exports = {
  DEFAULT_FILENAME,
  DEFAULT_ITEM_TEMPLATE,
  DEFAULT_TEMPLATE,
  VALUE_IDENTIFIER,
  FILE_IDENTIFIER,
  RESULT_IDENTIFIER,
  EMPTY_FIND_STATEMENT,
  NO_VALUE_IDENTIFIER,
  NO_RESULT_IDENTIFIER,
  IGNORE_HISTORY_ARG,
  HISTORY_DIRECTORY
}