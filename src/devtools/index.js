/*
This is the primary devtools "page"
It is not displayed, but rather used to inject panels/sidebars/etc
*/

chrome.devtools.panels.create('ETHDevTools', 'img/logo.png', 'pages/devtoolspanel.html', (panel) => {
  console.log('hello from callback');
});
