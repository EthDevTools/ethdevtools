import Vue from 'vue';
import Router from 'vue-router';

import LogsTab from './tabs/logs';
import ContractsTab from './tabs/contracts-tab';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  // scrollBehavior(to, from, savedPosition) {
  //   return savedPosition || { x: 0, y: 0 };
  // },
  routes: [
    { path: '', name: 'home', redirect: { name: 'logs' } },
    { path: '/logs', name: 'logs', component: LogsTab },
    { path: '/contracts', name: 'contracts', component: ContractsTab },
  ],
});

export default router;
