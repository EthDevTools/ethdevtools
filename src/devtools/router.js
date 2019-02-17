/* eslint-disable object-property-newline */
import Vue from 'vue';
import Router from 'vue-router';

import LogsViewer from './subpanels/logs-viewer';
import ABIPlayground from './subpanels/abi-playground';
import GraphExplorer from './subpanels/graph-explorer';
import SaltExplorer from './subpanels/salt-explorer';

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
    { path: '/salt-explorer', name: 'salt-explorer', component: SaltExplorer },
  ],
});

export default router;
