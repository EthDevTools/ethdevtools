import _isString from 'lodash/isString';
import _get from 'lodash/get';


// used to broadcast messages from any extension components
export async function broadcastMessage(payload) {
  return new Promise((resolve, reject) => {
    // if broadcasting from a webpage (not a content script, but one actually injected into the page)
    // then we cannot use chrome.runtime.sendMessage, and must instead use window.postMessage
    // to pass our message via the content script

    const fullPayload = {
      _msgSource: process.env.EXTENSION_MESSAGE_ID,
      ..._isString(payload) ? { message: payload } : payload,
    };

    if (chrome.devtools) {
      fullPayload._inspectedTabId = chrome.devtools.inspectedWindow.tabId;
    }

    // detect if we are in a webpage
    if (!chrome.runtime || !chrome.runtime.id) {
      // console.log('> sending message from webpage', fullPayload, window.origin);
      // pass the message via the window to our injector script which will relay it
      window.postMessage(JSON.stringify(fullPayload), window.origin);
    } else {
      // console.log('> sending message from chrome.runtime.sendMessage', fullPayload);
      chrome.runtime.sendMessage(process.env.EXTENSION_ID, fullPayload, (response) => {
        console.log('< response from extension', response);
        resolve(response);
      });
    }
  });
}


export function listenForMessages(messageHandler) {
  chrome.runtime.onMessage.addListener((payload, sender, reply) => {
    // ignore messages that are not from our extension
    if (payload._msgSource !== process.env.EXTENSION_MESSAGE_ID) return;

    messageHandler(payload, sender, reply);
  });
}
export function listenForMessagesFromTab(tabId, messageHandler) {
  chrome.runtime.onMessage.addListener((payload, sender, reply) => {
    // ignore messages that are not from our extension
    if (payload._msgSource !== process.env.EXTENSION_MESSAGE_ID) return;
    if (_get(sender, 'tab.id') !== tabId) return;

    messageHandler(payload, sender, reply);
  });
}


// Scripts injected into the actual page (ex: injected.js) cannot communicate direcctly with our extension
// so we must use window.postMessage to send a message, and our content script (injector.js) must relay
// that message back to our extension using chrome.runtime.sendMessage
export function initializeWebpageMessageRelayer() {
  window.addEventListener('message', (e) => {
    if (!e.data) return;
    let messageData;
    try {
      messageData = JSON.parse(e.data);
    } catch (err) {
      return;
    }

    if (messageData._msgSource !== process.env.EXTENSION_MESSAGE_ID) return;
    chrome.runtime.sendMessage(process.env.EXTENSION_ID, messageData);
  });
}

export function listenForOpenResources(resourceHandler) {
  chrome.devtools.panels.setOpenResourceHandler((resource) => {
    resourceHandler(resource);
  });
}
