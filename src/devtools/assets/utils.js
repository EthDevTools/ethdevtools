import BigNumber from 'bignumber.js';
import { AbiCoder } from 'web3-eth-abi';

const abiCoder = new AbiCoder();

const abiDecoder = require('abi-decoder');

export const processMethod = {
  eth_accounts: () => ({
    to: null,
    name: null,
    params: null,
  }),
  eth_call: (args, _, contracts) => {
    console.log('eth_call');
    const contractAddress = `${args[1][0].to.toLowerCase()}`;
    const methodSig = args[1][0].data.slice(0, 10);

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
    const foo = {
      to: contractAddress,
      name,
      params,
    };
    console.log('add eth call with this data', foo);
    return foo;
  },
  eth_gasPrice: (args) => {
    console.log('eth_gasPrice');
    return {
      to: null,
      name: null,
      params: null,
    };
  },
  eth_sendTransaction: (args, _, contracts) => {
    console.log('eth_sendTransaction');
    const contractAddress = `${args[1][0].to.toLowerCase()}`;
    const methodSig = args[1][0].data.slice(0, 10);

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
    console.log('eth_call in parser 2');
    let method; let params;
    console.log({ args });
    const contractAddress = args[1][0].to;
    console.log({ contractAddress });
    console.log({ contracts });
    console.log(contracts[contractAddress]);
    if (contracts[contractAddress]) {
      abiDecoder.addABI(contracts[contractAddress].abi);
      const abis = abiDecoder.getABIs();
      console.log({ abis });
      const sig = args[1][0].data.slice(0, 10);
      console.log({ sig });
      method = abis.find((m) => m.signature === args[1][0].data.slice(0, 10));
    }

    console.log({ method });
    if (method) {
      console.log('method', method);
      console.log(abiCoder);
      params = abiCoder.decodeParameters(method.outputs, results.join(''));
      console.log(results);
    }
    console.log({ method }, { params });
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
