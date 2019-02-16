import _ from 'lodash';
import Vue from 'vue';

import '@/lib/vue-setup';
import store from './store';
// import router from './router';


import app from './app';

const router = require('./router').default;

chrome.runtime.onMessage.addListener((payload, sender) => {
  console.log('devtools pane message', payload);
  // filter out any messages coming from other tabs
  if (!payload.w3dt_action) return;
  if (_.get(sender, 'tab.id') !== chrome.devtools.inspectedWindow.tabId) return;

  if (payload.w3dt_action === 'contract') {
    store.commit('ADD_CONTRACT', payload);
  } else if (payload.w3dt_action === 'send') {
    store.commit('ADD_SEND_LOG', payload);
  } else if (payload.w3dt_action === 'send-response') {
    store.commit('UPDATE_SEND_RESPONSE', payload);
  } else if (payload.w3dt_action === 'message') {
    store.commit('ADD_MESSAGE_LOG', payload);
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
