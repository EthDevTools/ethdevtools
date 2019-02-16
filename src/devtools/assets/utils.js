import BigNumber from 'bignumber.js';
import web3ABI from 'web3-eth-abi';

const abiDecoder = require('abi-decoder');

export const processMethod = {
  eth_accounts: () => ({
    to: null,
    name: null,
    params: null,
  }),
  eth_call: (args, _, contracts) => {
    const contractAddress = `${args[1][0].to.toLowerCase()}`;
    const methodSig = args[1][0].data;

    let decodedInput; let name; let
      params;

    if (contracts[contractAddress]) {
      abiDecoder.addABI(contracts[contractAddress].abi);
      decodedInput = abiDecoder.decodeMethod(methodSig);
      name = `${decodedInput.name}(${decodedInput.params.map((p) => p.type).join(',')})`;
      params = decodedInput.params.length ? decodedInput.params : null;
    } else {
      name = methodSig;
      params = methodSig;
    }
    return {
      to: contractAddress,
      name,
      params,
    };
  },
  eth_gasPrice: (args) => {
    console.log('gas price', args);
    return {
      to: null,
      name: null,
      params: null,
    };
  },
  eth_sendTransaction: (args, _, contracts) => {
    const contractAddress = `${args[1][0].to.toLowerCase()}`;
    const methodSig = args[1][0].data;

    let decodedInput = null;
    if (contracts[contractAddress]) {
      abiDecoder.addABI(contracts[contractAddress].abi);
      decodedInput = abiDecoder.decodeMethod(methodSig);
    }
    return {
      to: contractAddress,
      name: decodedInput.name,
      params: decodedInput.params.length ? decodedInput.params : null,
    };
  },
  eth_getTransactionReceipt: (args) => ({
    to: null,
    name: null,
    params: {
      tx: args[1][0],
    },
  }),
  default: (args, method) => {
    console.log(`UNKNOWN MSG TYPE ${method}`, args);
    return {
      to: null,
      name: null,
      params: args,
    };
  },
};

export const processResult = {
  eth_accounts: (args, results) => ({
    params: results.length ? results[0] : results,
  }),
  eth_call: (args, results, _, contracts) => {
    console.log('!!!!!!!!!!!!! eth_call, process result', { args });
    let params;
    const method = abiDecoder.getABIs().find((m) => m.signature === args[1][0].data.slice(0, 10));
    console.log(abiDecoder.getABIs().map((m) => `${m.name}-${m.signature}`));
    console.log(args);
    if (method) {
      console.log('method', method);
      params = web3ABI.decodeParameters(method.outputs, results.join(''));
      console.log(results);
    }
    return {
      params,
    };
  },
  eth_getTransactionReceipt: (args, results, _, contracts) => {
    let params = results;
    if (results.length && results[0] && results[0].logs) {
      const decodedLogs = abiDecoder.decodeLogs(results[0].logs);
      params[0].logsDecoded = decodedLogs;
    }
    params = results.length ? results[0] : null;
    return {
      params,
    };
  },
  eth_gasPrice: (args, results) => {
    const cost = new BigNumber(results[0], 16);
    const gasResult = {};
    gasResult.wei = cost.toString(10);
    gasResult.eth = cost.div(1e18).toString(10);
    gasResult.original = cost.div(1e18).toString(16);
    return {
      params: gasResult,
    };
  },
  eth_sendTransaction: (args, results) => ({
    params: { tx: results[0] },
  }),
  default: (args, results, method, contracts) => {
    console.log(`UNKNOWN MSG RETURN ${method}`, results);
    return {
      params: results,
    };
  },
};
