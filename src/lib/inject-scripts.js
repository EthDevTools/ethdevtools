export function injectFunctionAsScript(fn) {
  // this weird injection technique means the code in that function does not have access to
  // the outer scope, and we can't use webpack to write a normal file
  console.log('INSTALLING SCRIPT DIRECTLY');
  const source = `;(${fn.toString()})(window)`;

  const script = document.createElement('script');
  script.textContent = source;
  document.documentElement.appendChild(script);
  script.parentNode.removeChild(script);
}


export function injectScriptFile(fileName) {
  // so instead we can inject a script tag with an external file to be loaded
  // but this one is not guaranteed to execute first :(

  const injectedScript = document.createElement('script');
  // injected script must be added to web_accessible_resources in manifest.js
  injectedScript.src = chrome.runtime.getURL(fileName);
  // injectedScript.onload = function () { this.remove(); };
  // (document.head || document.documentElement).appendChild(injectedScript);
  document.documentElement.appendChild(injectedScript);
  injectedScript.parentNode.removeChild(injectedScript);
}
