import Vue from 'vue';
import Meta from 'vue-meta';

import './init-filters';
// import '@/components/register-global-components';

Vue.config.productionTip = false;

Vue.use(Meta);

// waiting for html-webpack-plugin to provide this by default
// https://github.com/jantimon/html-webpack-plugin/issues/76

// we only need to insert the div on pre-render
if (!document.getElementById('root')) {
  const appDiv = document.createElement('div');
  appDiv.setAttribute('id', 'root');
  document.body.prepend(appDiv);
}
