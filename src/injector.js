// This script is injected into every page (can be configured in manifest)
// it is responsible for injecting more scripts and handling communication back to the extension

// import _ from 'lodash';
import { broadcastMessage, initializeWebpageMessageRelayer } from '@/lib/message-passing';
import { injectFunctionAsScript, injectScriptFile } from '@/lib/inject-scripts';

// our injected scripts cannot communicate directly with our extension
// so we have to add a relayer which passes them
initializeWebpageMessageRelayer();

// send an initial page loaded message (also fires on page reload)
broadcastMessage({ action: 'page_reload' });

async function inlineInjectedScript(win) {
  if (win.ethereum) {
    console.log('found ethereum from directly injected script');
  } else {
    console.log('ethereum NOT found from directly injected script');
  }
}

if (document instanceof HTMLDocument) {
  console.log('INJECTOR SCRIPT!', window, chrome.runtime);

  // injecting the script directly ensures it is executed first
  injectFunctionAsScript(inlineInjectedScript);
  injectScriptFile('js/injected.js');
}
