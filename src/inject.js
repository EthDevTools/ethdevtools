// This script is injected into the page
// it is responsible for injecting more scripts and handling communication back to the extension

/* eslint-disable no-param-reassign */

console.log('inject script loaded');

window.addEventListener('message', (e) => {
  if (e.source !== window) return;
  if (e.data.w3dt_action) {
    console.log('sending message to chrome runtime', e.data);
    chrome.runtime.sendMessage(e.data);
  }
});


// This is the block that actually gets injected into our page
function injectedScript(win) {
  function emitW3dtAction(action, details) {
    console.log(`emit actionzzz - ${action}`, details);
    win.postMessage({
      w3dt_action: action,
      ...typeof details === 'string' ? { message: details } : details,
    }, '*');
  }

  function patchWeb3(web3) {
    console.log('patching provider!', web3);
    const { currentProvider } = web3;

    const contractDecoders = {};

    const currentProviderSend = currentProvider.send;
    const newSend = function (...args) {
      console.log('running patched send method');
      const requestId = Math.floor(Math.random() * 1000000);
      emitW3dtAction('send', {
        sendId: requestId,
        method: args[0],
        args: args[1],
      });
      const prom = currentProviderSend.apply(currentProvider, args);
      prom.then((...results) => {
        emitW3dtAction('send-response', {
          sendId: requestId,
          results,
        });
      });
      return prom;
    };
    currentProvider.send = newSend;

    web3.setProvider('');
    web3.setProvider(currentProvider);

    const oldContract = web3.eth.Contract;
    const newContract = function (...args) {
      emitW3dtAction('contract', {
        address: args[1],
        abi: args[0],
      });
      return oldContract.apply(oldContract, args);
    };
    web3.eth.Contract = newContract;
    return web3;
  }

  console.log('LOOK FOR WEB3');
  if (win.web3) {
    patchWeb3(win.web3);
    emitW3dtAction('log', 'web3 detected!');
  }
}


// inject the web3 patch
function installScript(fn) {
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
