/* eslint-disable object-property-newline */
import Vue from 'vue';
import Router from 'vue-router';

import LogsViewer from './subpanels/logs-viewer/index.vue';
import ABIPlayground from './subpanels/abi-playground.vue';
import GraphExplorer from './subpanels/graph-explorer.vue';
import SaltWatcher from './subpanels/salt-watcher.vue';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  // scrollBehavior(to, from, savedPosition) {
  //   return savedPosition || { x: 0, y: 0 };
  // },
  routes: [
    { path: '', name: 'account-overview', redirect: { name: 'logs' } },
    { path: '/logs', name: 'logs', component: LogsViewer },
    { path: '/abi-playground', name: 'abi-playground', component: ABIPlayground },
    { path: '/graph-explorer', name: 'graph-explorer', component: GraphExplorer },
    { path: '/salt-watcher', name: 'salt-watcher', component: SaltWatcher },
  ],
});

export default router;
