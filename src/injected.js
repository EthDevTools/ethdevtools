/* eslint-disable no-param-reassign, no-underscore-dangle, prefer-destructuring */

// This script is injected into every page (can be configured in manifest)
// it is responsible for injecting more scripts and handling communication back to the extension

import _ from 'lodash';
import { broadcastMessage } from '@/lib/message-passing';

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

function attemptPatchWeb3() {
  console.log('ATTEMPTING TO PATCH WEB3');

  let currentProvider;
  if (window.ethereum) {
    console.log('found window.ethereum');
    currentProvider = window.ethereum;
  } else if (window.web3) {
    console.log('found window.web3', window.web3.currentProvider);
    currentProvider = window.web3.currentProvider;
  } else {
    console.log('web3 not found :(');
    return;
  }

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
      if (key === 'currentProvider') {
        console.log('PROXY - setting current provider');
      }
      target[key] = value;
      return true;
    },
  });

  // replace provider with our proxy
  window.web3.currentProvider = devtoolsProxyProvider;
  window.ethereum = devtoolsProxyProvider;
  console.log('replaced web3 with our proxy');
}


attemptPatchWeb3(window);

// setInterval(() => {
//   console.log(`web 3 ? ${window.web3 ? 'found' : 'not found'}`);
// }, 1000);
