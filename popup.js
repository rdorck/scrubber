// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

/*
 * Document Event Listener
 */
document.addEventListener('DOMContentLoaded', function() {
  colorTrace('**** Hello Scrubber ****', 'blue');

  var currentWindow = null;

  // Get Current Window
  chrome.windows.getCurrent({}, function(data) {
    colorTrace('\n**** Getting Current Chrome Window...', '#b28f37');
    console.log(data);
    currentWindow = data;

    colorTrace('\tGetting current window localStorage...', '#b28f37');
    var localStorage = window.localStorage.getItem('jStorage');
    console.log(localStorage);

    colorTrace('>>>> Completed - Current Window id -> ' + currentWindow.id, 'green');
  });

  // Event Listener - Window Changed
  chrome.windows.onFocusChanged.addListener(function(currentWindow) {
    colorTrace('\n>>>> Chrome Window Changed', 'purple');
    console.log(currentWindow);
  });

  // Event Listener - Storage Changed
  chrome.storage.onChanged.addListener(function(changes, local) {
    colorTrace('\n>>>> Storage Changed', 'purple');
    console.log(changes);

    for (var i = 0; i < changes.length; i++) {
      console.log(changes[i]);
    }

    colorTrace('\n>>>> Completed Logging Storage Keys', 'green');
  });


  var storageKeys = {'foo': 'bar'};

  // Chrome.Storage set
  chrome.storage.local.set(storageKeys, function() {
    colorTrace('\n>>>> Setting chrome.storage Key(s) -> ' + JSON.stringify(storageKeys), '#b28f37');
  });

  // Chrome.Storage get
  chrome.storage.local.get('foo', function(data) {
    colorTrace('\n**** Getting Storage Key ****', '#b28f37');
    console.log(data);
    colorTrace('>>>> [Completed]: Storage Key -> ' + JSON.stringify(data), 'green');
  });

  var localStorage = window.localStorage.getItem('jStorage');
  console.log(localStorage);
  console.log('**** Completed window.localStorage.get()\n');

  // Get Current Popup HTML file
  chrome.browserAction.getPopup({}, function(result) {
    colorTrace('\n**** Getting Current Popup...', '#b28f37');
    console.log(result);
  });

  // Browser Action Event Listener - onClicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    colorTrace('\n**** Browser Action - onClicked ****', '#b28f37');
    console.log(tab);
    colorTrace('>>>> Completed - Browser Action', 'green');
  });

  // Get Current Tab
  chrome.tabs.getCurrent(function(tab) {
    colorTrace('\n**** Getting Current Tab...', '#b28f37');
    if (tab) {
      console.log(tab);
    } else {
      colorTrace('>>>> Current Tab is running in background\n', 'green');
    }
  });

  // Get All Tabs in Window
  chrome.tabs.query({}, function(allTabs) {
    colorTrace('\n**** Getting All Tabs...', '#b28f37');
    console.log(allTabs);
    colorTrace('>>>> Completed - All tabs <<<<', 'green');
  });

  // Query Specific Window
  chrome.tabs.query({'windowId': 426}, function(data) {
    colorTrace('**** Window Data #426 ****');
    console.log(data);
  });

  // Add Content Script
  chrome.tabs.executeScript({
    file: 'scrubber.js',
    allFrames: true
  }, function(response) {
    colorTrace('\n**** Execute Script Fired cleaning...', 'blue');
    console.log(response);
  });

  // Get Visible Tab
  chrome.tabs.captureVisibleTab({}, function(data) {
    colorTrace('\n>>>> Tab visible', 'green');
    //console.log(data);
  });

  document.querySelector('button').addEventListener('click', clean);

  // getCurrentTabUrl(function(url) {
  //   // Put the image URL in Google search.
  //   renderStatus('Performing Google search for ' + url);
  //
  //   // getImageUrl(url, function(imageUrl, width, height) {
  //   //
  //   //   renderStatus('Search term: ' + url + '\n' +
  //   //       'Google image search result: ' + imageUrl);
  //   //   var imageResult = document.getElementById('image-result');
  //   //   // Explicitly set the width/height to minimize the number of reflows. For
  //   //   // a single image, this does not matter, but if you're going to embed
  //   //   // multiple external images in your page, then the absence of width/height
  //   //   // attributes causes the popup to resize multiple times.
  //   //   imageResult.width = width;
  //   //   imageResult.height = height;
  //   //   imageResult.src = imageUrl;
  //   //   imageResult.hidden = false;
  //   //
  //   // }, function(errorMessage) {
  //   //   renderStatus('Cannot display image. ' + errorMessage);
  //   // });
  // });
});
