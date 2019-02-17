import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import { processMethod, processResult } from './assets/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logs: {}, // will be keyed by ID,
    sends: [],
    results: {},
    contracts: {},
  },
  getters: {
    logs: (state) => _.orderBy(_.values(state.logs), 'at'),
    contracts: (state) => _.values(state.contracts),
  },
  mutations: {
    ADD_MESSAGE_LOG: (state, payload) => {
      console.log('ADD_MESSAGE_LOG', { payload });
      if (payload.message === 'web3 detected!') {
        Vue.set(state, 'logs', {});
        Vue.set(state, 'sends', []);
        Vue.set(state, 'results', {});
        Vue.set(state, 'contracts', {});
      }
      Vue.set(state.logs, `message|${+new Date()}`, {
        at: new Date(),
        type: 'message',
        label: payload.message,
      });
    },
    ADD_SEND_LOG: (state, payload) => {
      console.log('ADD_SEND', { payload });

      const processLogMessage = processMethod[payload.method] || processMethod.default;
      const logMessage = processLogMessage(payload.args, payload.method, state.contracts);
      logMessage.method = payload.method;
      logMessage.id = payload.id;
      logMessage.time = +new Date();
      logMessage.args = payload.args;
      logMessage.method = payload.method;

      state.sends.unshift(logMessage);
      Vue.set(state.logs, `send|${payload.id}`, logMessage);
    },
    UPDATE_SEND_RESPONSE: (state, payload) => {
      console.log('ADD_SEND_RESPONSE', { payload });

      const { args } = state.sends.find((s) => s.id === payload.id);
      const method = args[0];
      const processLogResult = processResult[method] || processResult.default;
      const logResult = processLogResult(args, payload.results, method, state.contracts);
      logResult.id = payload.id;
      logResult.time = +new Date();
      logResult.method = payload.method;

      Vue.set(state.results, logResult.id, logResult);
      Vue.set(state.logs[`send|${payload.id}`], 'response', payload.response);
    },
    ADD_CONTRACT: (state, payload) => {
      console.log('ADD_CONTRACT', { payload });
      Vue.set(state.contracts, payload.address.toLowerCase(), payload);
      Vue.set(state.logs, `contract|${payload.address}`, {
        at: new Date(),
        payload,
        label: `CONTRACT ADDED - ${payload.address}`,
      });
    },
  },
  actions: {},
});
