/* eslint-disable no-param-reassign, no-underscore-dangle, prefer-destructuring */

// This script is injected into every page (can be configured in manifest)
// it is responsible for injecting more scripts and handling communication back to the extension

console.log('INJECTED SCRIPT!', window, chrome.runtime);

// send an initial page loaded message (also fires on page reload)

// // handle messages via window
// window.addEventListener('message', (e) => {
//   // filter our noisy react dev tools messages
//   if (e.data.source && e.data.source.includes('react')) return;

//   console.log(`👂 window message from ${e.source === window ? 'window' : e.source}`);
//   console.log(e.data, e);
// });

// // handle messages from chrome runtime
// chrome.runtime.onMessage.addListener((payload, sender, reply) => {
//   console.log(`👂 chrome runtime message from ${sender.tab ? 'tab' : sender}`);
//   console.log(payload);
//   if (payload.ping) reply({ pong: true });
// });

// broadcastMessage({ action: 'page_reload' });

function attemptProxyWeb3() {
  console.log('ATTEMPTING TO PATCH WEB3');

  let currentProvider;
  if (window.ethereum) {
    console.log('found window.ethereum', window.ethereum);
    currentProvider = window.ethereum;
  } else if (window.web3) {
    console.log('found window.web3', window.web3);
    console.log('found window.web3.currentProvider', window.web3.currentProvider);
    currentProvider = window.web3.currentProvider;
  } else {
    console.log('web3 not found :(');
    return;
  }

  console.log('creating proxy');
  const devtoolsProxyProvider = new Proxy(currentProvider, {
    get(target, key, context) {
      console.log('DEVTOOLS PROXY GET', key);
      if (key === 'enable') {
        const _originalEnable = target[key];
        return function newEnable(...args) {
          console.log('!!! web3 enable logged', args);
          broadcastMessage({ action: 'enable', args });
          return _originalEnable(...args);
        };
      } else if (key === 'send') {
        console.log(target, context);
        const _originalSend = target[key];

        return function w3dtSend(...args) {
          // const requestId = Math.floor(Math.random() * 1000000);
          console.log('!!! web3 send logged', args);
          broadcastMessage({ action: 'send', method: args[0], args });

          // // when it's sent as an object an error occurs
          // emitW3dtAction(key, JSON.stringify({
          //   id: requestId,
          //   method: args[0],
          //   foo: 'bar',
          //   args,
          // }));
          const returnOfOriginalSend = _originalSend(...args);
          console.log(returnOfOriginalSend);
          return returnOfOriginalSend;
        };
      } else if (key === 'sendAsync') {
        // sendAsync calls rely on a callback
        // so we must swap out the original callback to catch the result

        const _originalSend = target[key];

        return function w3dtSendAsync(...args) {
          console.log('!!! web3 sendAsync logged', args);
          const requestId = args[0].id;
          broadcastMessage({
            action: 'send',
            requestId,
            time: +new Date(),
            method: args[0].method,
            params: args[0].params,
          });

          const originalCallback = args.pop();
          const w3dtSendAsyncCallback = function (...callbackArgs) {
            console.log('!!! web3 sendAsync callback!', callbackArgs);
            broadcastMessage({
              action: 'send_result',
              requestId: callbackArgs[1].id,
              result: callbackArgs[1].result,
            });
            originalCallback(...callbackArgs);
          };
          args.push(w3dtSendAsyncCallback);

          return _originalSend(...args);
        };
      }
      return target[key];
    },
    set(target, key, value, receiver) {
      console.log('SET RUN');
      if (key === 'currentProvider') {
        console.log('PROXY - setting current provider');
      }
      target[key] = value;
      return true;
    },
  });
  window.devtoolsProxyProvider = devtoolsProxyProvider;
}

function attemptPatchWeb3() {
  attemptProxyWeb3(window);
  window.devtoolsProxyProvider = window.devtoolsProxyProvider;

  console.log('created proxy provider', window.devtoolsProxyProvider);
  // replace provider with our proxy
  console.log('replacing web3.currentProvider', window.web3.currentProvider);
  window.web3.currentProvider = window.devtoolsProxyProvider;
  console.log('replacing web3.ethereum', window.web3.ethereum);
  window.ethereum = window.devtoolsProxyProvider;
  console.log('replaced web3 with our proxy', window.web3.currentProvider, window.ethereum);
}

attemptProxyWeb3();
attemptPatchWeb3();

// used to broadcast messages from any extension components
// NOTE: This function is duplicated here rather than imported from message-passing.js because it fixes a bug on certain websites. No idea why :).
async function broadcastMessage(payload) {
  return new Promise((resolve, reject) => {
    // if broadcasting from a webpage (not a content script, but one actually injected into the page)
    // then we cannot use chrome.runtime.sendMessage, and must instead use window.postMessage
    // to pass our message via the content script

    const fullPayload = {
      _msgSource: process.env.EXTENSION_MESSAGE_ID,
      ...(typeof payload === 'string' ? { message: payload } : payload),
    };

    if (chrome.devtools) {
      fullPayload._inspectedTabId = chrome.devtools.inspectedWindow.tabId;
    }

    // detect if we are in a webpage
    if (!chrome.runtime.id) {
    // pass the message via the window to our content script which will relay it
      window.postMessage(JSON.stringify(fullPayload), window.origin);
    } else {
      console.log('> sending message from chrome.runtime.sendMessage', fullPayload);
      chrome.runtime.sendMessage(process.env.EXTENSION_ID, fullPayload, (response) => {
        console.log('< response from extension', response);
        resolve(response);
      });
      // } else {
      //   chrome.runtime.sendMessage(process.env.EXTENSION_ID, fullPayload);
    }
  });
}
