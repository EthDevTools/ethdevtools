/* eslint-disable no-param-reassign, no-underscore-dangle, prefer-destructuring */

// This script is injected into every page (can be configured in manifest)
// it is responsible for injecting more scripts and handling communication back to the extension

import _ from 'lodash';
import { broadcastMessage } from '@/lib/message-passing';

// send an initial page loaded message (also fires on page reload)


// handle messages via window
window.addEventListener('message', (e) => {
  // filter our noisy react dev tools messages
  if (e.data.source && e.data.source.includes('react')) return;

  console.log(`👂 window message from ${e.source === window ? 'window' : e.source}`);
  console.log(e.data, e);
});

// handle messages from chrome runtime
chrome.runtime.onMessage.addListener((payload, sender, reply) => {
  console.log(`👂 chrome runtime message from ${sender.tab ? 'tab' : sender}`);
  console.log(payload);
  if (payload.ping) reply({ pong: true });
});

// attemptPatchWeb3(window);

console.log('root');
console.log(chrome.runtime);

// This is the code that actually gets injected into our page
// and has access to the window / web3 global
async function injectedScript(win) {
  console.log('injected');
  console.log(chrome.runtime);

  broadcastMessage({ action: 'page_reload' });


  function attemptPatchWeb3(window) {
    console.log('ATTEMPTING TO PATCH WEB3');
    if (window.ethereum) {
      console.log('found window.ethereum');
    } else if (window.web3) {
      console.log('found window.web3', window.web3.currentProvider);
    }
  }

  attemptPatchWeb3(win);


  // setInterval(() => {
  //   console.log(`web 3 ? ${window.web3 ? 'found' : 'not found'}`);
  // }, 1000);
}


// a script to install the script directly rather than loading from another file
// necessary sometimes if you need to intercept activity on the page before other things load
function installScript(fn) {
  console.log('inject.js - installScript()');
  const source = `;(${fn.toString()})(window)`;

  const script = document.createElement('script');
  script.textContent = source;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}

if (document instanceof HTMLDocument) {
  // injecting the script directly ensures it is executed first
  installScript(injectedScript);
}
