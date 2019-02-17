/* eslint-disable no-param-reassign, prefer-destructuring */
import BigNumber from 'bignumber.js';
import _ from 'lodash';
import Vue from 'vue';
import Vuex from 'vuex';
// import { processMethod, processResult } from './assets/utils';
import { AbiCoder } from 'web3-eth-abi';
import AbiDecoder from 'abi-decoder';

window.AbiDecoder = AbiDecoder;

const abiCoder = new AbiCoder();

Vue.use(Vuex);

const EQ_PARAMS = ['method', 'params', 'result'];

const store = new Vuex.Store({
  state: {
    logs: {}, // will be keyed by ID,
    sends: [],
    results: {},
    contracts: {},
    accounts: {},
  },
  getters: {
    logs: (state) => _.orderBy(_.values(state.logs), 'time'),
    contracts: (state) => _.values(state.contracts),
    accounts: (state) => state.accounts,
  },
  mutations: {
    CLEAR_LOGS: (state) => {
      state.logs = {};
    },
    METAMASK_MESSAGE: (state, { data }) => {
      // payload.data.id
      // payload.data.method
      // payload.data.params
      if (data.result !== undefined) { // can be null!
        data.resultTime = +new Date();
        const req = state.logs[`req|${data.id}`];
        const annotatedResult = getAnnotatedResult(req, data.result);
        if (typeof data.result !== 'undefined') Vue.set(state.logs[`req|${data.id}`], 'result', data.result);
        Vue.set(state.logs[`req|${data.id}`], 'annotatedResult', annotatedResult);
        Vue.set(state.logs[`req|${data.id}`], 'resultTime', +new Date());
        if (req.method === 'eth_accounts') {
          state.accounts = data.result;
        }
        state.sends.push(data.result);
      } else {
        data.type = 'send';
        data.time = +new Date();
        annotateParams(data);
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
      Vue.set(state.logs, `message|${+new Date()}`, {
        time: +new Date(),
        type: 'message',
        message: payload.message,
      });
    },
    // ADD_SEND_LOG: (state, payload) => {
    //   console.log('ADD_SEND', { payload });


    //   const processLogMessage = processMethod[payload.method] || processMethod.default;
    //   const logMessage = processLogMessage(payload.args, payload.method, state.contracts);
    //   logMessage.method = payload.method;
    //   logMessage.id = payload.id;
    //   logMessage.time = +new Date();
    //   logMessage.args = payload.args;
    //   logMessage.method = payload.method;

    //   state.sends.unshift(logMessage);
    //   Vue.set(state.logs, `send|${payload.id}`, logMessage);
    // },
    // UPDATE_SEND_RESPONSE: (state, payload) => {
    //   console.log('ADD_SEND_RESPONSE', { payload });

    //   const { args } = state.sends.find((s) => s.id === payload.id);
    //   const method = args[0];
    //   const processLogResult = processResult[method] || processResult.default;
    //   const logResult = processLogResult(args, payload.results, method, state.contracts);
    //   logResult.id = payload.id;
    //   logResult.time = +new Date();
    //   logResult.method = payload.method;

    //   Vue.set(state.results, logResult.id, logResult);
    //   Vue.set(state.logs[`send|${payload.id}`], 'response', payload.response);

    //   if (args[0] === 'eth_accounts') {
    //     Vue.set(state.accounts, 'accounts', logResult.params);
    //   }
    // },
    ADD_CONTRACT: (state, payload) => {
      console.log('ADD_CONTRACT', { payload });
      Vue.set(state.contracts, payload.address.toLowerCase(), payload);
      Vue.set(state.logs, `contract|${payload.address}`, {
        time: +new Date(),
        type: 'contract',
        address: payload.address,
      });
      AbiDecoder.addABI(payload.abi);
    },
  },
  actions: {},
});


function annotateParams(data) {
  const { method, params } = data;
  if (['eth_accounts', 'net_version', 'eth_gasPrice'].includes(method)) {
    data.annotatedParams = null;
  } else if (method === 'eth_getTransactionReceipt') {
    data.annotatedParams = params[0];
  } else if (['eth_call', 'eth_sendTransaction'].includes(method)) {
    const contractAddress = params[0].to;
    const methodSig = params[0].data.slice(0, 10);
    const gasPrice = (params[0].gasPrice || '').slice(0, 10);

    data.contractAddress = contractAddress;
    const contract = store.state.contracts[contractAddress];
    let decodedInput;
    if (contract) {
      decodedInput = AbiDecoder.decodeMethod(methodSig);
      data.callName = `${decodedInput.name}(${decodedInput.params.map((p) => p.type).join(',')})`;
      data.annotatedParams = decodedInput.params.length ? decodedInput.params : null;
    } else {
      data.callName = methodSig;
      data.annotatedParams = methodSig;
    }
  } else {
    console.log(`UNKNOWN METHOD -- ${method}`);
  }
}
function getAnnotatedResult(req, result) {
  if (!req) {
    console.log('getAnnotatedResults of no req', req, result);
    return null;
  }
  const { method, params } = req;
  if (method === 'eth_gasPrice') {
    const cost = new BigNumber(result, 16);
    return {
      wei: cost.toString(10),
      eth: cost.div(1e18).toString(10),
      original: cost.div(1e18).toString(16),
    };
  }
  if (method === 'eth_sendTransaction') return { tx: result };
  if (method === 'eth_call') {
    const contract = store.state.contracts[req.contractAddress];
    if (contract) {
      const abis = AbiDecoder.getABIs();
      const methodSig = req.params[0].data.slice(0, 10);
      console.log({ methodSig });
      const abiMethod = _.find(abis, { signature: methodSig });
      console.log({ abiMethod });
      if (abiMethod) {
        console.log(abiCoder);
        const decodedResult = abiCoder.decodeParameters(abiMethod.outputs, result);
        console.log(decodedResult);
        return decodedResult;
      }
    }
  }
  if (method === 'eth_getTransactionReceipt') {
    if (result && result.logs) {
      console.log('HAS RESULT!');
      const annotatedResult = _.cloneDeep(result);
      annotatedResult.decodedLogs = AbiDecoder.decodeLogs(result.logs);
      return annotatedResult;
    }
  }
  return result;
}

export default store;
