import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logs: {}, // will be keyed by ID
  },
  getters: {
    logs: (state) => _.values(state.logs),
  },
  mutations: {
    ADD_LOG: (state, log) => {
      Vue.set(state.logs, log.id, log);
    },
  },
  actions: {},
});
