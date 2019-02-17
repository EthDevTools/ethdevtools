import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import FullContract from './FullContract.jsx';

class ABIPlayGround extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      selectedContractIndex: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({selectedContractIndex: event.target.value});
  }

  render() {
    console.log(this.props.contracts)
    const selectedContract = this.props.contracts[this.state.selectedContractIndex];
    return <div className="native-bar">
      <div>
        <div className="select-style">
          <select value={this.state.selectedContractIndex} onChange={this.handleChange}>
            <option disabled value=''>Select a Contract to Interact with</option>
            {this.props.contracts.map((contract, index) => <option key={contract.address} value={index}>
              {contract.address}
            </option>)}
          </select>
        </div>
        <div className="custom-graph">
          {selectedContract && <FullContract contract={selectedContract} />}
        </div>
      </div>
    </div>;
  }
}

export default ABIPlayGround;
