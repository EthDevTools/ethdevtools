// This script is called when the user opens the Chrome devtools on a page
// and it persists until the devtools panel is closed
// here we intiailize any panels and sidebar panes

import { broadcastMessage, listenForMessagesFromTab } from '@/lib/message-passing';

let panel;
let panelShown = false;
let sidebar;

const inspectedTabId = chrome.devtools.inspectedWindow.tabId;
const chromeTheme = chrome.devtools.panels.themeName === 'dark' ? 'dark' : 'light';

function createPanel() {
  chrome.devtools.panels.create('Web3', 'icons/128.png', `devtools-panel.html?theme=${chromeTheme}`, (_panel) => {
    panel = _panel;
    panel.onShown.addListener(() => {
      broadcastMessage({
        action: 'devtools_panel_shown',
      });
      panelShown = true;
    });
    panel.onHidden.addListener(() => {
      broadcastMessage({
        action: 'devtools_panel_hidden',
      });
      panelShown = false;
    });
  });
}

// createPanel();

const WEB3_ACTIONS = ['enable', 'send'];

// also listen for messages from our injected script, so that if devtools was already open
// but panel has not yet been initialized, we can initialize it
// NOTE - our background script already filters out messages and only sends relevant ones
listenForMessagesFromTab(inspectedTabId, (payload, sender, reply) => {
  if (WEB3_ACTIONS.includes(payload.action) && !panel) createPanel();

  // const enabled = broadcastMessage({ action: 'check_devtools_enabled' });
  // console.log('received a message... Enabled? ', enabled, panel);
  // if (enabled && !panel) createPanel();
});


// send message to background script to check if we should show devtools panel for this
// for example, if we have detected something on the page
(async function init() {
  const enabled = await broadcastMessage({ action: 'check_devtools_enabled' });
  console.log('Enabled? ', enabled, panel);
  if (enabled && !panel) createPanel();
}());
