/* eslint-disable no-param-reassign, prefer-destructuring */
import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';

// import { AbiCoder } from 'web3-eth-abi';
import AbiDecoder from 'abi-decoder';


import { broadcastMessage, listenForMessagesFromTab, listenForOpenResources } from '@/lib/message-passing';


Vue.use(Vuex);

// window.AbiDecoder = AbiDecoder;
// const abiCoder = new AbiCoder();

let logCounter = 0;

const store = new Vuex.Store({
  state: {
    inspectedTabId: chrome.devtools.inspectedWindow.tabId,
    logs: {}, // will be keyed by id (counter)
    contracts: {}, // keyed by address
    accounts: {},
  },
  getters: {
    logs: (state) => _.orderBy(_.values(state.logs), 'time'),
    contracts: (state) => _.values(state.contracts),
  },
  mutations: {
    CLEAR_LOGS: (state) => {
      state.logs = {};
    },
    CLEAR_CONTRACTS: (state) => {
      state.contracts = {};
    },
    ADD_MESSAGE_LOG: (state, payload) => {
      const id = logCounter++;
      Vue.set(state.logs, `message|${id}`, {
        time: +new Date(),
        type: 'message',
        message: payload.message,
        payload,
      });
    },
    ADD_SEND_LOG: (state, payload) => {
      console.log('ADD_SEND_LOG', payload);

      // payload { requestId, time, method, params}
      const log = {
        ...payload,

      };

      Vue.set(state.logs, payload.requestId, log);


      // payload.data.id
      // payload.data.method
      // payload.data.params
      // if (data.result !== undefined) { // can be null!
      //   data.resultTime = +new Date();
      //   const req = state.logs[`req|${data.id}`];
      //   const annotatedResult = getAnnotatedResult(req, data.result);
      //   if (typeof data.result !== 'undefined') Vue.set(state.logs[`req|${data.id}`], 'result', data.result);
      //   Vue.set(state.logs[`req|${data.id}`], 'annotatedResult', annotatedResult);
      //   Vue.set(state.logs[`req|${data.id}`], 'resultTime', +new Date());
      //   if (req.method === 'eth_accounts') {
      //     state.accounts = data.result;
      //   }
      //   state.sends.push(data.result);
      // } else {
      //   data.type = 'send';
      //   data.time = +new Date();
      //   annotateParams(data);
      //   Vue.set(state.logs, `req|${data.id}`, data);

      //   // const processLogMessage = processMethod[data.method] || processMethod.default;
      //   // const logMessage = processLogMessage(data.params, data.method, state.contracts);
      //   // logMessage.method = data.method;
      //   // logMessage.id = data.id;
      //   // logMessage.time = +new Date();
      //   // logMessage.args = data.params;
      //   // state.sends.push(logMessage);
      //   // Vue.set(state.logs, `send|${data.id}`, logMessage);
      // }
    },
    UPDATE_LOG_RESULT: (state, payload) => {
      // const { args } = state.sends.find((s) => s.id === payload.id);
      // const method = args[0];
      // const processLogResult = processResult[method] || processResult.default;
      // const logResult = processLogResult(args, payload.results, method, state.contracts);
      // logResult.id = payload.id;
      // logResult.time = +new Date();
      // logResult.method = payload.method;
      Vue.set(state.logs[payload.requestId], 'result', payload.result);
      console.log(state.logs[payload.requestId]);
      // Vue.set(state.logs[`send|${payload.id}`], 'response', payload.response);

      // if (args[0] === 'eth_accounts') {
      //   Vue.set(state.accounts, 'accounts', logResult.params);
      // }
    },
    ADD_CONTRACT: (state, payload) => {
      console.log('ADD_CONTRACT', { payload });
      const newContracts = state.contracts.concat(payload);
      state.contracts = newContracts;
      AbiDecoder.addABI(payload);
    },
  },
  actions: {
    async initializeAndGetHistory(ctx) {
      // ctx.commit('ADD_MESSAGE_LOG', { message: 'devtools startup - fetch history' });
      const pastEvents = await broadcastMessage({ action: 'fetch_events_history' });
      _.each(pastEvents, (event) => {
        ctx.dispatch('processEvent', event);
      });
    },
    processEvent(ctx, payload) {
      const { action } = payload;
      if (action === 'page_reload') {
        ctx.commit('CLEAR_LOGS', payload);
      } else if (action === 'contract') {
        ctx.commit('ADD_CONTRACT', payload);
      } else if (action === 'send') {
        const log = _.pick(payload, [
          'requestId', 'time', 'action', 'method',
        ]);
        if (payload.method === 'eth_call') {
          log.contractAddress = payload.params[0].to;
          log.params = payload.params[0].data;
          log.blockNumber = payload.params[1];
        } else if (payload.method === 'eth_accounts') {

        }


        console.log(payload.params);
        // if (payload.method === 'eth_call') {
        //   log.contractAddress = payload.params[0].to;
        //   log.params = payload.params[0].data;
        // }
        store.commit('ADD_SEND_LOG', log);
      } else if (action === 'send_result') {
        store.commit('UPDATE_LOG_RESULT', payload);
      } else if (action === 'log') {
        store.commit('ADD_MESSAGE_LOG', payload);
      }
    },
    processContract(ctx, abiJSON) {
      ctx.commit('ADD_CONTRACT', abiJSON);
    },
    logMessage(ctx, payload) {
      console.log('log message action');
      ctx.commit('ADD_MESSAGE_LOG', payload);
    },
  },
});

store.dispatch('initializeAndGetHistory');


listenForMessagesFromTab(chrome.devtools.inspectedWindow.tabId, (payload, sender, reply) => {
  console.log('👂 devtools panel store heard runtime message');
  console.log(payload);
  store.dispatch('processEvent', payload);
});

listenForOpenResources((resource) => {
  resource.getContent((content) => {
    console.log('resource opened: ', content);
    let contentJSON;
    try {
      const contentJSON = JSON.parse(content);
      console.log(contentJSON);
      store.dispatch('processContract', contentJSON);
    } catch (err) {

    }
  });
});

export default store;
