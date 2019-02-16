const tabs = {};

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  console.log('background msg listener!', payload, sender);

  const action = payload.w3dt_action;
  if (!action) return;

  const tabId = sender.tab ? sender.tab.id : payload.tabId;
  if (!tabId) return;
  tabs[tabId] = tabs[tabId] || {};

  if (action === 'check_enabled') {
    sendResponse(tabs[tabId].enabled);
    return;
  }

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
