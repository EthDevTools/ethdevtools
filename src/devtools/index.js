import _ from 'lodash';
import Vue from 'vue';

import '@/lib/vue-setup';
import store from './store';

import app from './app';
// import router from './router';
window.store = store;

const router = require('./router').default;

chrome.runtime.onMessage.addListener((payload, sender) => {
  console.log('index.js - chrome.runtime.onMessage.addListener');
  // filter out any messages coming from other tabs
  if (!payload.w3dt_action) return;
  // if (_.get(sender, 'tab.id') !== chrome.devtools.inspectedWindow.tabId) return;
  processEvent(payload);
});

function processEvent(payload) {
  console.log('processEvent', payload);
  // filter out any messages coming from other tabs
  if (!payload.w3dt_action) return;
  if (payload.w3dt_action === 'page-reload') {
    store.commit('CLEAR_LOGS', payload);
  } else if (payload.w3dt_action === 'contract') {
    store.commit('ADD_CONTRACT', payload);
  } else if (payload.w3dt_action === 'send') {
    store.commit('ADD_SEND_LOG', payload);
  } else if (payload.w3dt_action === 'send-response') {
    store.commit('UPDATE_SEND_RESPONSE', payload);
  } else if (payload.w3dt_action === 'log') {
    store.commit('ADD_MESSAGE_LOG', payload);
  } else if (payload.w3dt_action === 'check-enabled') {
    store.commit('ADD_MESSAGE_LOG', payload);
  } else if (payload.w3dt_action === 'message') {
    store.commit('ADD_MESSAGE_LOG', payload);
  } else if (payload.w3dt_action === 'metamask-message') {
    store.commit('METAMASK_MESSAGE', payload);
  } else if (payload.w3dt_action === 'explorer-result') {
    console.log('GOT EXPLORER RESULT');
    window.explorerUpdate(payload);
  } else if (payload.w3dt_action === 'connected') {
    console.log('CONNECTED', { payload });
    store.commit('SET_CONNECTED', payload);
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
