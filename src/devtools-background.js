// This script is called when the user opens the Chrome devtools on a page.
// We check to see if our global hook has detected web3 on the page
// If yes, create the DevTools panel; otherwise poll for 10 seconds

let mainPanel;
const panelLoaded = false;
const panelShown = false;
let pendingAction;
let created = false;
let checkWeb3Interval;
let checkCount = 0;

// create a long-lived communication channel between this page and the
// main extension "background"
const port = chrome.runtime.connect({
  name: `devtoolsbg-${chrome.devtools.inspectedWindow.tabId}`,
});
port.onMessage.addListener((payload) => {
  if (payload.action === 'connected') {
    if (created) return;
    chrome.devtools.panels.create(
      'ETHDevTools', 'icons/128.png', 'pages/devtoolspanel.html',
      (panel) => {
        mainPanel = panel;
        console.log('dev tools panel created cb');
        // panel.onShown.addListener(() => {
        //   chrome.runtime.sendMessage('web3-panel-shown');
        //   panelShown = true;
        //   // if (panelLoaded) executePendingAction();
        // });
        // panel.onHidden.addListener(() => {
        //   chrome.runtime.sendMessage('web3-panel-hidden');
        //   panelShown = false;
        // });
      },
    );
    created = true;
  } else if (payload.action === 'disconnected') {

  }
});


function checkForWeb3() {
  if (created || checkCount++ > 10) return;
  port.postMessage({ action: 'check-connection' });
}

// Runtime messages

chrome.runtime.onMessage.addListener((payload) => {
  console.log('devtoolsbg - runtime message listener', payload);
  // if (request === 'vue-panel-load') {
  //   onPanelLoad()
  // } else if (request.vueToast) {
  //   toast(request.vueToast.message, request.vueToast.type)
  // } else if (request.vueContextMenu) {
  //   onContextMenu(request.vueContextMenu)
  // }
});

// Page context menu entry

// function onContextMenu ({ id }) {
//   if (id === 'vue-inspect-instance') {
//     const src = `window.__VUE_DEVTOOLS_CONTEXT_MENU_HAS_TARGET__`

//     chrome.devtools.inspectedWindow.eval(src, function (res, err) {
//       if (err) {
//         console.log(err)
//       }
//       if (typeof res !== 'undefined' && res) {
//         panelAction(() => {
//           chrome.runtime.sendMessage('vue-get-context-menu-target')
//         }, 'Open Vue devtools to see component details')
//       } else {
//         pendingAction = null
//         toast('No Vue component was found', 'warn')
//       }
//     })
//   }
// }

// Action that may execute immediatly
// or later when the Vue panel is ready

// function panelAction (cb, message = null) {
//   if (created && panelLoaded && panelShown) {
//     cb()
//   } else {
//     pendingAction = cb
//     message && toast(message)
//   }
// }

// function executePendingAction () {
//   pendingAction && pendingAction()
//   pendingAction = null
// }

// Execute pending action when Vue panel is ready

// function onPanelLoad () {
//   executePendingAction()
//   panelLoaded = true
// }

// // Toasts
// function toast (message, type = 'normal') {
//   const src = `(function() {
//     __VUE_DEVTOOLS_TOAST__(\`${message}\`, '${type}');
//   })()`

//   chrome.devtools.inspectedWindow.eval(src, function (res, err) {
//     if (err) {
//       console.log(err)
//     }
//   })
// }

chrome.devtools.network.onNavigated.addListener(checkForWeb3);
checkWeb3Interval = setInterval(checkForWeb3, 1000);
checkForWeb3();
