
var panels = chrome.devtools.panels;

panels.create(
  "Scrubber",
  "Cleaning_6-128.png",
  "panel.html",
  function(panel) {
    colorTrace('\n>>>> Creating DevTools Panel...', 'purple');
    console.log(panel);
  }
);

panels.elements.createSidebarPane('', function(sidebar) {
  colorTrace('\n>>>> Creating DevTools Sidebar...', 'purple');
  console.log(sidebar);
});

chrome.runtime.sendMessage({owner: 'devtools'}, function(response) {
  colorTrace('\n>>>> devtools-chrome.js Sending Message... >>>>', 'purple');
  console.log(response);
  colorTrace('**** Completed - Sending Message ****', 'green');
});
