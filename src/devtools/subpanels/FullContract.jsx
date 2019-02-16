import React, { Component } from 'react';

import MethodCallTracker from './MethodCallTracker.jsx';

class FullContract extends Component {
  constructor(props, context) {
    super(props);
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

  render() {

    const contract = this.props.contract;
    const events = contract.abi.filter(entry => entry.type === 'event');
    const methods = contract.abi.filter(entry => entry.type !== 'event');
    const constants = contract.abi.filter(entry => entry.type === 'function' && entry.constant === true && entry.inputs.length === 0);
    const lookups = contract.abi.filter(entry => entry.type === 'function' && entry.constant === true && entry.inputs.length !== 0);
    const mutators = contract.abi.filter(entry => entry.type === 'function' && entry.constant === false);

    // if(!contract.initialized) {
    //   return <div>
    //     <h2>{this.props.contract} Contract Tester</h2>
    //     <span>Initializing...</span>
    //   </div>;
    // }

    //TODO: test multioutput
    //TODO: get struct in/out working

    return <span>
      <h2>Contract Tester</h2>
      <div>
        <div>Constants:</div>
        <div>
          {constants.map(constant => <div key={constant.name}>
            <span>{constant.name}: </span>
          </div>)}
        </div>
      </div>
      <div>
        <div>Lookups:</div>
        <div>
          {lookups.map(method => <MethodCallTracker key={method.name}
            ABIMethod={method}
            constant={true} />)}
        </div>
      </div>
      <div>
        <div>Mutators</div>
        <div>
          {mutators.map(method => <MethodCallTracker key={method.name}
            ABIMethod={method}
            constant={false} />)}
        </div>
      </div>
    </span>;

    // // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
    // // if(!(this.dataKey in this.props.contracts[this.props.contract][this.props.method])) {
    // //   return (
    // //     <span>Fetching...</span>
    // //   )
    // // }
    //
    // // Show a loading spinner for future updates.
    // var pendingSpinner = contract.synced ? '' : ' 🔄'
    //
    // // Optionally hide loading spinner (EX: ERC20 token symbol).
    // if (this.props.hideIndicator) {
    //   pendingSpinner = ''
    // }
    //
    // // var displayData = contract[this.props.method][this.dataKey].value
    //
    // // Optionally convert to UTF8
    // if (this.props.toUtf8) {
    //   // displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData)
    // }
    //
    // // Optionally convert to Ascii
    // if (this.props.toAscii) {
    //   // displayData = this.context.drizzle.web3.utils.hexToAscii(displayData)
    // }
    //
    // // If return value is an array
    // if (typeof displayData === 'array') {
    //   const displayListItems = displayData.map((datum, index) => {
    //     <li key={index}>{datum}{pendingSpinner}</li>
    //   })
    //
    //   return(
    //     <ul>
    //       {displayListItems}
    //     </ul>
    //   )
    // }
    //
    // // If retun value is an object
    // if (typeof displayData === 'object') {
    //   var i = 0
    //   const displayObjectProps = []
    //
    //   Object.keys(displayData).forEach((key) => {
    //     if (i != key) {
    //       displayObjectProps.push(<li key={i}>
    //         <strong>{key}</strong>{pendingSpinner}<br/>
    //         {displayData[key]}
    //       </li>)
    //     }
    //
    //     i++
    //   })
    //
    //   return(
    //     <ul>
    //       {displayObjectProps}
    //     </ul>
    //   )
    // }
    //
    // return(
    //   <span>{displayData}{pendingSpinner}</span>
    // )
  }
}

export default FullContract;
