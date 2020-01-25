// This script is injected into the page
// it is responsible for injecting more scripts and handling communication back to the extension

/* eslint-disable no-param-reassign, no-underscore-dangle, prefer-destructuring */

// this just passes along the messages to our extension
window.addEventListener('message', (e) => {
  if (e.source !== window) return;
  try {
    // messages coming from metamask
    // commented out as patch method is attemptped
    if (e.data.data.name === 'provider') {
      // console.log('>METAMASKMESSAGE', e.data.data.data);
      // chrome.runtime.sendMessage({
      //   w3dt_action: 'metamask-message',
      //   data: e.data.data.data,
      // });
    }
  } catch (err) {
    // just allow easier nested gets
  }
  if (e.data.w3dt_action) {
    console.log(`> ${e.data.w3dt_action}`, e.data);
    chrome.runtime.sendMessage(e.data);
  }
});

chrome.runtime.sendMessage({
  w3dt_action: 'page-reload',
});


// This is the code that actually gets injected into our page
// and has access to the window / web3 global
function injectedScript(win) {
  function emitW3dtAction(action, details) {
    let data = {
      w3dt_action: action,
      ...typeof details === 'string' ? { message: details } : details,
    }
    win.postMessage(data, '*');
    // maybe should just post directly to chrome.runtime?
    // requires app id to send from browser (passing via window skips this?)
    // chrome.runtime.sendMessage(data);
  }
  window.emitW3dtAction = emitW3dtAction;

  function attemptPatchWeb3() {
    console.log('inject.js - attemptPatchWeb3')
    // const globalEthereum = win.ethereum;
    // const globalWeb3 = win.web3;

    if (win.ethereum) {
      console.log('+ ethereum global found');
      emitW3dtAction('message', 'ethereum global found!');
    } else {
      emitW3dtAction('message', 'ethereum global NOT found!');
      return;
    }
    
    let currentProvider = win.ethereum || win.web3.currentProvider;
    console.log({ currentProvider });
    let override = {
      get: function( target, key, context ) {

        if ((key === 'sendAsync' || key === 'send')) {
          console.log({target})
          console.log({key})
          console.log({context})
          const _originalSend = target[key]

          const newSend = function (...args) {

            console.log('newSend')
            const requestId = Math.floor(Math.random() * 1000000);

            // when it's sent as an object an error occurs
            emitW3dtAction(key, JSON.stringify({
              id: requestId,
              method: args[0],
              foo: 'bar',
              args,
            }));
            return _originalSend(...args)
          };
          return newSend
        }
        return target[key]
      }
    }

    win.web3.currentProvider = win.ethereum = new Proxy(currentProvider, override)

    // was this doing anything?
    // vvvvvvv

    // const _OriginalContract = globalWeb3.eth.Contract;
    // window.originalContracts = {};
    // globalWeb3.eth.Contract = function (...args) {
    //   const originalContract = new _OriginalContract(...args);
    //   const contractEntry = {};

    //   console.log({ originalContract });
    //   const address = arguments[1] || originalContract.address || originalContract._address;
    //   contractEntry[address] = originalContract;
    //   Object.assign(window.originalContracts, contractEntry);
    //   emitW3dtAction('contract', {
    //     address: args[1],
    //     abi: args[0],
    //   });
    //   return originalContract;
    // };
  }

  console.log('+ injected patch script');
  attemptPatchWeb3();
}


// inject the web3 patch
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

  // this method of injection was too late to catch the contract call
  // const script = document.createElement('script');
  // script.setAttribute('type', 'text/javascript');
  // script.setAttribute('src', chrome.extension.getURL('js/web3patch.js'));
  // document.body.appendChild(script);
}
