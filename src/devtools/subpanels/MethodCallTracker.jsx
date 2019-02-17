import React, { Component } from 'react';

class MethodCallTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit() {
    if(this.props.constant) {
      // this.props.method.cacheCall(...Object.values(this.state));
    }
    else {
      // this.props.method.cacheSend(...Object.values(this.state));
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
    </div>;
  }

}

export default MethodCallTracker;
