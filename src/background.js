chrome.runtime.onMessage.addListener((payload, sender) => {
  console.log('window post message!', payload, sender);

  if (sender.tab && payload.web3Detected) {
    console.log(`Enabling tab ${sender.tab.id} ETHDevTools`);
    chrome.browserAction.setIcon({
      tabId: sender.tab.id,
      path: {
        // 16: 'icons/16.png',
        // 48: 'icons/48.png',
        128: '/icons/128-enabled.png',
      },
    });
    // chrome.browserAction.setPopup({
    //   tabId: sender.tab.id,
    //   popup: req.web3Detected ? 'popups/enabled.html' : 'popups/disabled.html',
    // });
  }
});

chrome.extension.onConnect.addListener((port) => {
  console.log('Connected .....');
  port.onMessage.addListener((msg) => {
    console.log(`message recieved ${msg}`);
    port.postMessage('Hi Popup.js');
  });
});
