import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class WatchAddress extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
    }
  }

  render() {
    return <div>
      Watching address: {this.props.address}
    </div>;
  }
}

export default WatchAddress;
