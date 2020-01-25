// This script is called when the user opens the Chrome devtools on a page.
// We check to see if our global hook has detected web3 on the page
// If yes, create the DevTools panel; otherwise poll for 10 seconds


let panelEnabled = false;
let mainPanel;

// create a long-lived communication channel between this page and the
// main extension "background"
// const port = chrome.runtime.connect({
//   name: `devtoolsbg-${chrome.devtools.inspectedWindow.tabId}`,
// });
// port.onMessage.addListener((payload) => {
// });


function createPanel() {
  console.log('devtools-background.js - createPanel()');
  panelEnabled = true;
  chrome.devtools.panels.create(
    'web3', 'icons/128.png', 'pages/devtools.html',
    (panel) => {
      mainPanel = panel;
      // panel.onShown.addListener(() => {
      //   chrome.runtime.sendMessage('web3-panel-shown');
      //   panelShown = true;
      //   // if (panelLoaded) executePendingAction();
      // });
      // panel.onHidden.addListener(() => {
      //   chrome.runtime.sendMessage('web3-panel-hidden');
      //   panelShown = false;
      // });
    },
  );
}

chrome.runtime.onMessage.addListener((payload) => {
  console.log('devtools-background.js - chrome.runtime.onMessage.addListener((payload) => {})');
  console.log('devtools bg msg', payload);
  if (payload.connect) {
    console.log('post window msg from devtools-background.js');
    const data = { type: 'FROM_BACK', text: 'Hello from the backend!' };
    chrome.runtime.sendMessage(data);
    window.postMessage(data, '*');
    return 'told em!';
  }
  if (!payload.w3dt_action) return;
  if (!panelEnabled) createPanel();
});

// do an initial check when devtools are first opened on this tab
chrome.runtime.sendMessage({
  w3dt_action: 'check-enabled', tabId: chrome.devtools.inspectedWindow.tabId,
}, (enabled) => {
  console.log('devtools-background.js - chrome.runtime.sendMessage(w3dt_action: check-enaled tab id:', chrome.devtools.inspectedWindow.tabId);
  if (enabled) createPanel();
});
