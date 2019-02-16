import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logs: {
      1: { label: 'dummy log 1' },
      2: { label: 'dummy log 2' },
      3: { label: 'dummy log 3' },
    },
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
