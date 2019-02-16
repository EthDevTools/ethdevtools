import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logs: {}, // will be keyed by ID
    contracts: {},
  },
  getters: {
    logs: (state) => _.orderBy(_.values(state.logs), 'at'),
    contracts: (state) => _.values(state.contracts),
  },
  mutations: {
    ADD_MESSAGE_LOG: (state, payload) => {
      Vue.set(state.logs, `message|${+new Date()}`, {
        at: new Date(),
        type: 'message',
        label: payload.message,
      });
    },
    ADD_SEND_LOG: (state, payload) => {
      console.log(payload);
      Vue.set(state.logs, `send|${payload.sendId}`, {
        at: new Date(),
        label: `METHOD CALL - ${payload.method}`,
        method: payload.method,
        args: payload.args,
      });
    },
    UPDATE_SEND_RESPONSE: (state, payload) => {
      Vue.set(state.logs[`send|${payload.sendId}`], 'response', payload.response);
    },
    ADD_CONTRACT: (state, payload) => {
      console.log(payload);
      // payload has { address, abi }
      Vue.set(state.logs, `contract|${payload.address}`, {
        at: new Date(),
        label: `CONTRACT ADDED - ${payload.address}`,
      });
      Vue.set(state.logs, payload.address, payload);
    },
  },
  actions: {},
});
