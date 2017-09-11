
/**
 * Set custom color to console log statements
 *
 * @param {string} msg
 * @param {string} color
 */
function colorTrace(msg, color) {
  console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
}

/**
 * Prints statement to console
 */
function knock() {
  console.log('*Knock Knock Knock* Housekeeping.... housekeeping');
}

/**
 * Set jStorage key:value pair
 * @param key
 * @param value
 */
function setKey(key, value) {
  if (key === null) {
    throw new Error('Key is required for setting in jStorage');
  }

  if (value === null) {
    throw new Error('Value is missing for key ' + key);
  }

  colorTrace('\n**** Setting jStorage {key:value} pair -> {' + key + ':' + value + '} ****', '#b28f37');
  $.jStorage.set(key, value);
}

/**
 * Get jStorage value for given key
 *
 * @param key
 * @return {string} value
 * @throws Error
 */
function getKeyValue(key) {
  if (key === null || key === 'undefined') {
    throw new Error('Key is required');
  }

  return $.jStorage.get(key);
}

/**
 * Delete keys from given array from jStorage
 */
function clean() {
  try {
    // Array of all keys
    var keys = $.jStorage.index();

    // Loop keys, deleting each one
    keys.forEach(key => {
      if (key) {
        colorTrace('Clean Key - "' + key + '".', 'purple');

        var value = getKeyValue(key);

        colorTrace('\n**** Found key:value pair -> {' + key + ':' + value + '} ****', 'green');
        colorTrace('Cleaning...', 'purple');

        $.jStorage.deleteKey(key);
        colorTrace('**** Key "' + key + '" was cleaned ****', 'green');
      }
    });

    colorTrace('\n**** Finished Cleaning ****', 'green');

  } catch (error) {
    colorTrace('\n**** ERROR - cleaning ****', 'red');
    console.log(error);
  }
}
