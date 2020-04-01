// This is the background script
// accessible in other components via chrome.runtime.getBackgroundPage()

import { broadcastMessage, listenForMessages } from '@/lib/message-passing';
import { setSettings, getSetting } from '@/lib/storage-helpers';

import './manifest'; // this is only to get the linter to run on it

const tabs = {};
window.tabs = tabs;

// Install handler
chrome.runtime.onInstalled.addListener(async () => {
  // await setSettings({
  //   setting1: 'Initial value setting 1',
  //   setting2: 'Initial value setting 2',
  // });
});

const WEB3_ACTIONS = ['enable', 'send'];

listenForMessages((payload, sender, reply) => { // eslint-disable-line consistent-return
  console.log('👂 background heard runtime message');
  console.log(sender.tab ? `TAB #${sender.tab.id}` : sender);
  console.log(payload);

  const { action } = payload;

  let tabId;
  if (sender.tab) tabId = sender.tab.id;
  else if (payload._inspectedTabId) tabId = payload._inspectedTabId;

  if (tabId) tabs[tabId] = tabs[tabId] || {};

  // Handle actions that do not tell us that
  if (action === 'check_devtools_enabled') {
    console.log('enabled ? ', tabs[tabId].enabled);
    return reply(tabs[tabId].enabled);
  } else if (action === 'page_reload') {
    tabs[tabId].history = [];
  } else if (action === 'fetch_events_history') {
    console.log(tabs[tabId].history);
    return reply(tabs[tabId].history);
  } else if (WEB3_ACTIONS.includes(action)) {
    tabs[tabId].enabled = true;
    tabs[tabId].history = tabs[tabId].history || [];
    tabs[tabId].history.push(payload);

    // enable the icon if not already
    chrome.browserAction.setIcon({
      tabId,
      path: {
        128: '/icons/128-enabled.png',
      },
    });
  }
});

// last minute cleanup
chrome.runtime.onSuspend.addListener(() => {
  // do not rely on this for persisitng data
  console.log('Unloading extension');
});


// omnibox handler - see `omnibox` definition in manifest
chrome.omnibox.onInputEntered.addListener((text) => {
  const newURL = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
  chrome.tabs.create({ url: newURL });
});

// trigger this from the background console to test sending a message
window.sendTestMessage = () => {
  console.log(chrome.tabs);

  // chrome.tabs.query({ active: true }, (tabs) => {
  //   chrome.tabs.sendMessage(tabs[0].id, {
  //     source: 'myextension',
  //     message: 'background says hi!',
  //   }, (response) => {
  //     console.log(response);
  //   });
  // });
};
