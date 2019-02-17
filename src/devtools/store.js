import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
import { processMethod, processResult } from './assets/utils';

Vue.use(Vuex);

const EQ_PARAMS = ['method', 'params', 'result'];

export default new Vuex.Store({
  state: {
    logs: {}, // will be keyed by ID,
    sends: [],
    results: {},
    contracts: {},
  },
  getters: {
    logs: (state) => _.orderBy(_.values(state.logs), 'time'),
    contracts: (state) => _.values(state.contracts),
    condensedLogs: (state, getters) => {
      const clogs = [];
      let lastLog;
      _.each(getters.logs, (log) => {
        if (
          lastLog
          && log.method === lastLog.method
          && JSON.stringify(log.params) === JSON.stringify(lastLog.params)
          && JSON.stringify(log.results) === JSON.stringify(lastLog.results)
        ) {
          lastLog.count++;
        } else {
          const newLog = _.cloneDeep(log);
          newLog.count = 1;
          clogs.push(newLog);
          lastLog = newLog;
        }
      });
      return clogs;
    },
  },
  mutations: {
    METAMASK_MESSAGE: (state, { data }) => {
      // payload.data.id
      // payload.data.method
      // payload.data.params
      if (data.result) {
        data.resultTime = +new Date();
        Vue.set(state.logs[`req|${data.id}`], 'result', data.result);
        Vue.set(state.logs[`req|${data.id}`], 'resultTime', +new Date());
        state.sends.push(data.result);
      } else {
        data.type = 'send';
        data.time = +new Date();


        Vue.set(state.logs, `req|${data.id}`, data);

        // const processLogMessage = processMethod[data.method] || processMethod.default;
        // const logMessage = processLogMessage(data.params, data.method, state.contracts);
        // logMessage.method = data.method;
        // logMessage.id = data.id;
        // logMessage.time = +new Date();
        // logMessage.args = data.params;
        // state.sends.push(logMessage);
        // Vue.set(state.logs, `send|${data.id}`, logMessage);
      }
    },
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

      state.sends.push(logMessage);
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
