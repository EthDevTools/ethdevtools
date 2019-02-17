// This script is injected into the page
// it is responsible for injecting more scripts and handling communication back to the extension

/* eslint-disable no-param-reassign, no-underscore-dangle, prefer-destructuring */

// import Web3 from 'web3';
// this just passes along the messages to our extension
window.addEventListener('message', (e) => {
  // console.log(e);

  try {
    // messages coming from metamask
    if (e.data.data.name === 'provider') {
      console.log(e.data.data.data);
      chrome.runtime.sendMessage({
        w3dt_action: 'metamask-message',
        data: e.data.data.data,
      });
    }
  } catch (err) {
    // just allow easier nested gets
  }

  if (e.source !== window) return;
  if (e.data.w3dt_action) {
    console.log(`> ${e.data.w3dt_action}`, e.data);
    chrome.runtime.sendMessage(e.data);
  }
});

// This is the code that actually gets injected into our page
// and has access to the window / web3 global
function injectedScript(win) {
  console.log('injected script');
  function emitW3dtAction(action, details) {
    win.postMessage({
      w3dt_action: action,
      ...typeof details === 'string' ? { message: details } : details,
    }, '*');
  }

  function attemptPatchWeb3() {
    const globalEthereum = win.ethereum;
    const globalWeb3 = win.web3;
    let currentProvider;

    if (win.ethereum) {
      console.log('+ ethereum global found');
      emitW3dtAction('message', 'ethereum global found!');
      // currentProvider = win.ethereum;
    } else {
      emitW3dtAction('message', 'ethereum global NOT found!');
      return;
    }
    // const localWeb3 = new win.Web3(globalWeb3.currentProvider);
    console.log(globalEthereum);
    console.log(globalWeb3);
    // console.log(localWeb3);
    console.log({ currentProvider });
    currentProvider = globalWeb3.currentProvider;

    // const _originalSend = currentProvider.send;

    // currentProvider.send = function (...args) {
    //   const requestId = Math.floor(Math.random() * 1000000);
    //   emitW3dtAction('send', {
    //     id: requestId,
    //     method: args[0],
    //     foo: 'bar',
    //     args,
    //   });
    //   const prom = _originalSend.apply(currentProvider, args);
    //   prom.then((...results) => {
    //     emitW3dtAction('send-response', {
    //       id: requestId,
    //       results,
    //     });
    //   });
    //   return prom;
    // };

    // globalWeb3.setProvider('');
    // globalWeb3.setProvider(currentProvider);

    const _OriginalContract = globalWeb3.eth.Contract;
    globalWeb3.eth.Contract = function (...args) {
      emitW3dtAction('contract', {
        address: args[1],
        abi: args[0],
      });
      return new _OriginalContract(...args);
    };
  }

  console.log('+ injected patch script');
  // setInterval(attemptPatchWeb3, 1000);
  attemptPatchWeb3();
}


// inject the web3 patch
function installScript(fn) {
  console.log('injecting script');
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
