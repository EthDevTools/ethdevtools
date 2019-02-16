const tabs = {};

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  console.log('background msg listener!', payload, sender);

  if (payload.w3dt_action === 'check_enabled') {
    sendResponse(tabs[payload.tabId] && tabs[payload.tabId].enabled);
    return;
  }

  if (sender.tab && payload.web3log) {
    tabs[sender.tab.id] = [sender.tab.id] || {};

    // enable popup if not enabled already
    if (!tabs[sender.tab.id].enabled) {
      tabs[sender.tab.id].enabled = true;

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
  }
});

chrome.extension.onConnect.addListener((port) => {
  console.log(`Background port connected - ${port.name}`);
  // const [, tabId] = port.name.split('-');

  // tabs[tabId] = tabs[tabId] || {};
  // tabs[tabId].ports = tabs[tabId].ports || [];
  // tabs[tabId].ports.push(port);

  // port.onMessage.addListener((payload) => {
  //   console.log('port mesage', payload);
  //   if (payload.action === 'check-connection') {
  //     if (tabs[tabId].enabled) port.postMessage({ action: 'connected' });
  //     else port.postMessage({ action: 'disconnected' });
  //   }
  // });
});
