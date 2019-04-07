/**Escapa caracteres para regex. */
module.exports = function (text) {
  return text.replace(/[.*+?^${}()|[\]\\']/g, '\\$&');
}