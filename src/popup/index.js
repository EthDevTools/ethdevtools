import Vue from 'vue';
import '@/lib/vue-setup';

import root from './popup-page';

Vue.config.productionTip = false;
new Vue({
  el: '#app',
  render: (h) => h(root),
});
