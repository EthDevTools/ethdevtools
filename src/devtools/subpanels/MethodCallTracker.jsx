import React, { Component } from 'react';

class MethodCallTracker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  // handleInputChange = (event) => {
  //   this.setState({ [event.target.name]: event.target.value });
  // }
  //
  // handleSubmit = _ => {
  // }

  render() {
    const ABIMethod = this.props.ABIMethod;
    // const contract = this.props.contract;
    const methodName = ABIMethod.name;
    // const method = contract[methodName];

    return <div key={methodName}>
      {methodName}
    </div>;
  }

}

export default MethodCallTracker;
