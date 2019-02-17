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
    console.log(this.props.contract);
    const events = contract.abi.filter(entry => entry.type === 'event');
    const methods = contract.abi.filter(entry => entry.type !== 'event');
    const constants = contract.abi.filter(entry => entry.type === 'function' && entry.constant === true && entry.inputs.length === 0);
    const lookups = contract.abi.filter(entry => entry.type === 'function' && entry.constant === true && entry.inputs.length !== 0);
    const mutators = contract.abi.filter(entry => entry.type === 'function' && entry.constant === false);

    return <span>
      <h2>Contract Tester</h2>
      <div>
        <div><b>Constants</b> (contract functions with no paramaters that do no mutation):</div>
        <div>
          {constants.map(method => <MethodCallTracker key={method.name}
            contractAddress={this.props.contract.address}
            ABIMethod={method}
            constant={true} />)}
        </div>
      </div>
      <br/>
      <div>
        <div><b>Lookups</b> (contract functions with paramaters that do no mutation):</div>
        <div>
          {lookups.map(method => <MethodCallTracker key={method.name}
            contractAddress={this.props.contract.address}
            ABIMethod={method}
            constant={true} />)}
        </div>
      </div>
      <br/>
      <div>
        <div><b>Mutators</b> (contract functions that may mutate)</div>
        <div>
          {mutators.map(method => <MethodCallTracker key={method.name}
            ABIMethod={method}
            constant={false} />)}
        </div>
      </div>
    </span>;

    // Show a loading spinner for future updates.
    // var pendingSpinner = contract.synced ? '' : ' 🔄'

    // Optionally hide loading spinner (EX: ERC20 token symbol).
    // if (this.props.hideIndicator) {
    //   pendingSpinner = ''
    // }

    // var displayData = contract[this.props.method][this.dataKey].value

    // Optionally convert to UTF8
    if (this.props.toUtf8) {
      // displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData)
    }

    // Optionally convert to Ascii
    if (this.props.toAscii) {
      // displayData = this.context.drizzle.web3.utils.hexToAscii(displayData)
    }

    // If return value is an array
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

    //   return(
    //     <ul>
    //       {displayObjectProps}
    //     </ul>
    //   )
    // }

    // return(
    //   <span>{displayData}{pendingSpinner}</span>
    // )
  }
}

export default FullContract;
