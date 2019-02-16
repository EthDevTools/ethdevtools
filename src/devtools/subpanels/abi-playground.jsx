import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TestABI from './testABI.json';

import FullContract from './FullContract.jsx';

class ABIPlayGround extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      selectedContract: TestABI
    }
  }

  render() {
    console.log(this.props.contracts)
    return <div>
      Select...
      <FullContract contract={this.state.selectedContract} />
    </div>;
  }
}

export default ABIPlayGround;
