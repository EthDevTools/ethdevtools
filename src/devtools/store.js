import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import { processMethod, processResult } from './assets/utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    logs: {}, // will be keyed by ID,
    sends: [],
    responses: {},
    contracts: {},
  },
  getters: {
    logs: (state) => _.orderBy(_.values(state.logs), 'at'),
    contracts: (state) => _.values(state.contracts),
  },
  mutations: {
    ADD_MESSAGE_LOG: (state, payload) => {
      console.log('ADD_MESSAGE_LOG');
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
      logMessage.id = payload.sendId;
      logMessage.time = +new Date();
      logMessage.args = payload.args;
      logMessage.method = payload.method;

      state.sends.unshift(logMessage);
      console.log('sends length', state.sends.length);
      Vue.set(state.logs, `send|${payload.sendId}`, logMessage);
    },
    UPDATE_SEND_RESPONSE: (state, payload) => {
      console.log('ADD_SEND_RESPONSE', { payload });
      console.log(payload.sendId);
      const processLogResult = processResult[payload.method] || processResult.default;
      console.log('sends', state.sends);
      const args = state.sends.find((s) => s.id === payload.sendId);
      console.log('args', args);
      const logResult = processLogResult(args, payload.results, payload.method, state.contracts);
      logResult.id = payload.sendId;
      logResult.time = +new Date();
      logResult.method = payload.method;

      Vue.set(state.results, logResult.id, logResult);
      Vue.set(state.logs[`send|${payload.sendId}`], 'response', payload.response);
    },
    ADD_CONTRACT: (state, payload) => {
      console.log('ADD_CONTRACT', { payload });
      // payload has { address, abi }
      Vue.set(state.contracts, payload.address, payload);
      Vue.set(state.logs, `contract|${payload.address}`, {
        at: new Date(),
        abi: payload.address,
        label: `CONTRACT ADDED - ${payload.address}`,
      });
    },
  },
  actions: {},
});
