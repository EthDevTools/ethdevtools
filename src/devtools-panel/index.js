import Vue from 'vue';
import '@/lib/vue-setup';

import root from './devtools-page';
import router from './router';
import store from './store';

window.store = store; // helpful for debugging

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  render: (h) => h(root),
});
