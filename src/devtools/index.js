import _ from 'lodash';
import Vue from 'vue';

import '@/lib/vue-setup';
import store from './store';
// import router from './router';


import app from './app';

const router = require('./router').default;

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
  router,
  render: (h) => h(app),
});
