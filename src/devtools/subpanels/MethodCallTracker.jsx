import React, { Component } from 'react';

class MethodCallTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      input: {},
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  displayValue(value) {
    return JSON.stringify(value);
  }

  translateType(type) {
    switch(true) {
      case /^uint/.test(type):
        return 'number';
        break;
      case /^string/.test(type) || /^bytes/.test(type):
        return 'text';
        break;
      case /^bool/.test(type):
        return 'checkbox';
        break;
      default:
        return 'text';
    }
  }

  handleInputChange(event) {
    this.setState({ input: { [event.target.name]: event.target.value } });
  }

  explorerUpdate(payload) {
    console.log('explorerUpdate')
    console.log({payload})
    this.setState({ result: JSON.stringify(payload.result) });
  }

  handleSubmit() {
    window.explorerUpdate = this.explorerUpdate.bind(this);
    const contractAddress = this.props.contractAddress;
    const methodName = this.props.ABIMethod.name;
    const params = Object.values(this.state.input).toString();
    console.log({ params });
    if(this.props.constant) {
      const evalText = `window.originalContracts['${contractAddress}'].methods.${methodName}(${params}).call().then(result => { window.emitW3dtAction('explorer-result', { result }) })`
      this.setState({ result: ' 🔄 ' });
      console.log({evalText});
      chrome.devtools.inspectedWindow.eval(evalText);
    }
    else {
      const evalText = `web3.eth.getAccounts().then(accounts => { window.originalContracts['${contractAddress}'].methods.${methodName}(${params}).send({ from: accounts[0] }).then(result => { window.emitW3dtAction('explorer-result', { result }) }) })`
      this.setState({ result: ' 🔄 ' });
      console.log({evalText});
      chrome.devtools.inspectedWindow.eval(evalText);
    }
  }

  render() {
    const ABIMethod = this.props.ABIMethod;
    const methodName = ABIMethod.name;
    console.log('ABIMethod')
    console.log(ABIMethod)
    return <div key={methodName}>
    <span>{methodName}: </span>
      <span>{ABIMethod.inputs.map((input, index) => {
        const inputType = this.translateType(input.type);
        const inputLabel = input.name;
        //TODO: check if input type is struct and if so loop out struct fields as well
        return <input key={input.name} type={inputType}
          onChange={this.handleInputChange}
          name={input.name}
          placeholder={inputLabel} />;
      })}</span>
      <button onClick={this.handleSubmit}>{this.props.constant? 'Call' : 'Send'}</button>
      {this.state.result && <span>{this.state.result}</span>}
    </div>;
  }

}

export default MethodCallTracker;
