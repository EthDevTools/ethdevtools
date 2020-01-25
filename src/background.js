const tabs = {};
window.tabs = tabs;

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  console.log('background msg listener!', payload, sender);

  const action = payload.w3dt_action;
  if (!action) {
    console.log('unknown payload', { payload });
    return;
  }

  const tabId = sender.tab ? sender.tab.id : payload.tabId;
  if (!tabId) return;
  tabs[tabId] = tabs[tabId] || {};

  if (action === 'check-enabled') {
    sendResponse(tabs[tabId].enabled);
    return;
  } else if (action === 'page-reload') {
    tabs[tabId].history = [];
    return;
  } else if (action === 'fetch-events-history') {
    sendResponse(tabs[tabId].history);
  } else {
    console.log('unknown action', action);
  }

  // enable popup if not enabled already
  tabs[sender.tab.id].enabled = true;
  chrome.browserAction.setIcon({
    tabId: sender.tab.id,
    path: {
      // 16: 'icons/16.png',
      // 48: 'icons/48.png',
      128: '/icons/128-enabled.png',
    },
  });

  // keep a history of events so when the devtools tab is opened we have all events
  tabs[tabId].history = tabs[tabId].history || [];
  tabs[tabId].history.push(payload);
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
