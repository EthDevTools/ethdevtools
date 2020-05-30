/* eslint-disable no-param-reassign, prefer-destructuring */

/*
  This script is injected into the page by injector.js
  so that it is able to access the same global `window` object that the actual webpage does

  We set up a new web3 provider that just proxies to the real one but sends logging info
  to our extension
*/


// IMPORTANT NOTE - USE REQUIRE INSTEAD OF IMPORT!
// have not been able to figure out why, but importing any file breaks the proxying setup
// while using require does not...  ¯\_(ツ)_/¯
const { broadcastMessage } = require('@/lib/message-passing');

function createProxyProvider() {
  console.log('INITIALIZING PROXY PROVIDER');

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

  window.devtoolsProxyProvider = new Proxy(currentProvider, {
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
      return Reflect.get(...arguments);
    },
    set(target, key, value) {
      if (key === 'currentProvider') {
        console.log('PROXY - setting current provider');
      }
      // target[key] = value;
      return Reflect.set(target, key, value);
    },
  });
  console.log('created proxy provider', window.devtoolsProxyProvider);
}

function attemptPatchWeb3() {
  console.log('PATCHING WEB3');
  // replace provider with our proxy
  console.log('window.web3', window.web3);
  console.log('replacing web3.currentProvider', window.web3.currentProvider);
  window.web3.currentProvider = window.devtoolsProxyProvider;
  console.log('replacing web3.ethereum', window.web3.ethereum);
  window.ethereum = window.devtoolsProxyProvider;
  console.log('replaced web3 with our proxy', window.web3.currentProvider, window.ethereum);
}

createProxyProvider();
attemptPatchWeb3();
