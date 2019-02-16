// This script is called when the user opens the Chrome devtools on a page.
// We check to see if our global hook has detected web3 on the page
// If yes, create the DevTools panel; otherwise poll for 10 seconds

let panelLoaded = false;
let panelShown = false;
let pendingAction;
let created = false;
let checkWeb3Interval;
let checkCount = 0;

function createPanelIfHasWeb3() {
  if (created || checkCount++ > 10) return;

  panelLoaded = false;
  panelShown = false;

  chrome.devtools.inspectedWindow.eval('window.globalweb3check()', (hasWeb3) => {
    console.log('devtools bg - ', hasWeb3);
  });

  chrome.devtools.inspectedWindow.eval('console.log("EVAL")', (hasWeb3) => {
    console.log('eval callback');
  });

  if (false) created = true;

  // chrome.devtools.inspectedWindow.eval('!!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue)', (hasVue) => {
  //   if (!hasVue || created) return;

  //   clearInterval(checkWeb3Interval);
  //   created = true;
  //   chrome.devtools.panels.create(
  //     'ETHDevTools', 'icons/128.png', 'pages/devtoolspanel.html',
  //     // panel loaded callback
  //     (panel) => {
  //       panel.onShown.addListener(() => {
  //         chrome.runtime.sendMessage('web3-panel-shown');
  //         panelShown = true;
  //         // if (panelLoaded) executePendingAction();
  //       });
  //       panel.onHidden.addListener(() => {
  //         chrome.runtime.sendMessage('web3-panel-hidden');
  //         panelShown = false;
  //       });
  //     },
  //   );
  // });
}

// Runtime messages

chrome.runtime.onMessage.addListener((request) => {

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

chrome.devtools.network.onNavigated.addListener(createPanelIfHasWeb3);
checkWeb3Interval = setInterval(createPanelIfHasWeb3, 1000);
createPanelIfHasWeb3();
