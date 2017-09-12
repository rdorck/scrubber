
/**
 * colorTrace - description
 *
 * @param  {string} msg   Text to be displayed in console.log()
 * @param  {string} color Hex representation of a color or a CSS color by name (i.e. 'purple')
 */
function colorTrace(msg, color) {
  console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
}

function constructor() {
  colorTrace('******************************************************************', 'purple');
  colorTrace('               >>>>    Initializing Scrubber...   <<<<            ', 'purple');
  colorTrace('                       __              _    _                  ', 'green');
  colorTrace('    __________       / __| __ ___ _  _| |__| |__  ___ ___      ', 'green');
  colorTrace('   |  ______  |       \u005C__ \u005C/ _|  _| || |  _ \u005C  _ \u005C/ -_)  _|     ', 'green');
  colorTrace(' __| |______| |__    |___/\u005C__|_| \u005C_,__|_.__/_.__/\u005C___|_|       ', 'green');
  colorTrace('|________________|   ________________________________________   ', 'green');
  colorTrace(' {{{{{{{{{{{{{{{{                                               ', '#c1ab2a');
  colorTrace(' *o*o*o*o*o*o*o*o*o*o*o*o*o*o                                     ', 'lightblue');
  colorTrace('                              READY!                              ', 'green');
  colorTrace('******************************************************************', 'green');

}

/**
 * setKey - Set jStorage key:value pair
 *
 * @param  {string} key   Key that will be used to index a value
 * @param  {string|object} value Data to be stored
 * @return {type}       description
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


document.addEventListener('DOMContentLoaded', function() {
  constructor();

  //setKey("pet", "dog");
});
