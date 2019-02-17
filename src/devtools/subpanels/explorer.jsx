import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import WatchAddress from './watch-address.jsx';

class Explorer extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      selectedAddress: ''
    }
  }

  render() {
    console.log(this.props.contracts)
    const selectedContract = this.props.contracts[this.state.selectedContractIndex];
    return <div>
      Select Address to watch:
      <select value={this.state.selectedAddress} onChange={this.handleChange}>
        <option disabled value=''>Select an address</option>
        {this.props.contracts.map((contract, index) => <option key={contract.address} value={contract.address}>
          {contract.address}
        </option>)}
      </select>

      {this.props.selectedAddress && <WatchAddress address={this.props.selectedAddress} />}
    </div>;
  }
}

export default Explorer;
