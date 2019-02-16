import _ from 'lodash';
import Vue from 'vue';

import '@/lib/vue-setup';
import store from './store';

import root from './root.vue';

console.log('DEVTOOLS PANEL INIT!');
console.log();

chrome.runtime.onMessage.addListener((payload, sender) => {
  // filter out any messages coming from other tabs
  if (_.get(sender, 'tab.id') !== chrome.devtools.inspectedWindow.tabId) return;
  if (payload.web3log) {
    store.commit('ADD_LOG', payload.web3log);
  }
});
window.store = store; // for debugging


Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  render: (h) => h(root),
});
