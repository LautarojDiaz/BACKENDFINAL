const { v4: uuidv4 } = require('uuid');


    /* GENERA NUVO ID USANDO LIBRERIA uuid */
function generateUniqueId() {
  return uuidv4();
}

module.exports = {
  generateUniqueId,
};
