
window.addEventListener('message', (e) => {
  if (e.source === window && e.data.web3Detected) {
    chrome.runtime.sendMessage(e.data);
  }
});


function installScript(fn) {
  const source = `;(${fn.toString()})(window)`;

  const script = document.createElement('script');
  script.textContent = source;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}


function detectWeb3(win) {
  setTimeout(() => {
    console.log('> looking for web3');
    const ethereumGlobalDetected = !!window.ethereum;
    const web3GlobalDetected = !!window.web3;

    if (ethereumGlobalDetected) {
      console.log('> web3 detected!');
      win.postMessage({
        web3Detected: true,
      }, '*');
    }
  }, 100);
}


// inject the hook
if (document instanceof HTMLDocument) {
  installScript(detectWeb3);
}
