import _ from 'lodash';
import Vue from 'vue';

import '@/lib/vue-setup';
import store from './store';

import app from './app';
// import router from './router';
window.store = store;

const router = require('./router').default;

chrome.runtime.onMessage.addListener((payload, sender) => {
  console.log('4) heard message in app');
  // filter out any messages coming from other tabs
  if (!payload.w3dt_action) return;
  console.log('devtools pane message', payload);
  // if (_.get(sender, 'tab.id') !== chrome.devtools.inspectedWindow.tabId) return;
  processEvent(payload);
});


function processEvent(payload) {
  console.log('processEvent', payload);
  // filter out any messages coming from other tabs
  if (!payload.w3dt_action) return;
  if (payload.w3dt_action === 'contract') {
    store.commit('ADD_CONTRACT', payload);
  } else if (payload.w3dt_action === 'send') {
    store.commit('ADD_SEND_LOG', payload);
  } else if (payload.w3dt_action === 'send-response') {
    store.commit('UPDATE_SEND_RESPONSE', payload);
  } else if (payload.w3dt_action === 'log') {
    store.commit('ADD_MESSAGE_LOG', payload);
  } else if (payload.w3dt_Action === 'check-enabled') {
    store.commit('ADD_MESSAGE_LOG', payload);
  } else if (payload.w3dt_Action === 'message') {
    store.commit('ADD_MESSAGE_LOG', payload);
  }
}

chrome.runtime.sendMessage({
  w3dt_action: 'fetch-events-history',
  tabId: chrome.devtools.inspectedWindow.tabId,
}, (history) => {
  console.log('adding from history');
  _.each(history, (event) => {
    processEvent(event);
  });
});

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  router,
  render: (h) => h(app),
});
