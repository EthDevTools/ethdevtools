/*
  This is the source for our "manifest.json" file
  But we transform it from js so we can include comments and eventually (maybe?) build it dynamically

  WARNING - auto reload doesn't work with this, so you must restart webpack after you make changes
*/

module.exports = {
  manifest_version: 2, // required
  name: 'ETH Dev Tools', // Title in chrome store and extensions settings UI
  version: '0.0.1',

  description: 'Developer tools panel for web3 developers',
  homepage_url: 'https://ethdevtools.xyz',
  icons: {
    // 16: 'icons/16.png',
    // 48: 'icons/48.png',
    128: 'icons/128-enabled.png',
  },
  permissions: [ // see https://developer.chrome.com/extensions/declare_permissions
    '<all_urls>',
    '*://*/*',
    'activeTab', // required to inject scripts in current tab
    'tabs',
    'background',
    'contextMenus', // for context menu - make sure to include a size 16 icon for this
    'unlimitedStorage',
    'storage',
    'notifications',
    'identity',
    'identity.email',
  ],
  incognito: 'spanning', // spanning|split -- see https://developer.chrome.com/extensions/manifest/incognito

  // background script - used to manage events and initialize other parts of the extensions
  // see https://developer.chrome.com/extensions/background_pages
  background: {
    scripts: ['js/background.js'],
    persistent: false,
  },

  // A "browser action" is the icon that appears to the right of the toolbar and is always available
  // see https://developer.chrome.com/extensions/browserAction
  // you can also switch to "page_action" if it is only applicable to the current page
  // https://developer.chrome.com/extensions/pageAction
  browser_action: {
    default_title: 'Action icon hover title', // tooltip text when hovering over the icon
    default_popup: 'popup.html', // content of "popup" that appears when you click the icon
    default_icon: {
      128: 'icons/128-disabled.png', // we start the icon disabled and enable it in background
    },
  },

  // extension options page
  options_ui: {
    page: 'options.html',
    open_in_tab: true, // set to false to show in a popup instead
  },

  // omnibox - this lets you hook into the omnnibox (url bar) by typing this string first
  // see background script for handler
  omnibox: {
    keyword: 'eth', // this should be short to trigger your extension to take over
  },

  // inject scripts into pages being browsed
  content_scripts: [
    {
      js: ['js/injector.js'],
      run_at: 'document_start', // "document_idle" preferred, but would not guarantee running first
      matches: ['<all_urls>'],
      all_frames: true, // otherwise just injected into main/topmost frame
    },
  ],

  // Extend chrome devtools
  // this page is not shown, it initializes other devtools components (panels, sidebars, etc)
  devtools_page: 'devtools.html', // it must be an html page for some reason

  content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'",
  web_accessible_resources: [
    'devtoolspanel.html',
    'js/injected.js',
  ],

};
