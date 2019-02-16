import Vue from 'vue';

import '@/lib/vue-setup';
import store from './store';

import root from './root.vue';

chrome.runtime.onMessage.addListener((payload, sender) => {
  console.log('devtools panel msg listener', payload, sender);
  // store.commit('ADD_LOG', payload);
});


Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#root',
  store,
  render: (h) => h(root),
});
