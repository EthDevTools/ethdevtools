import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import secrets from '../../secrets.json';

class WatchAddress extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
    }
    this.stopWatching = this.stopWatching.bind(this);
    this.ping = this.ping.bind(this);
    this.done = false;
  }

  render() {
    return <div>
      Watching address: {this.props.address}
      <button onClick={this.stopWatching}>
        Stop Watching
      </button>
    </div>;
  }

  ping() {
    this.socket.send("ping");
    if (!this.done) {
      setTimeout(this.ping.bind(this), 1000);
    }
  }

  componentDidMount() {
    this.done = false;
    const address = '0xeF42cF85bE6aDf3081aDA73aF87e27996046fE63';
    this.socket = new WebSocket(`ws://serene-waters-65951.herokuapp.com/socket/addressActivity/${address}`);
    this.socket.onmessage = (event) => {
      console.log(event.data);
    }
    this.socket.onopen = (event) => {
      console.log('starting websocket ping interval');
      this.ping();
    };
    fetch('https://meerkat.watch/api/v0/enterprise/subscribe/address', {
      method: "POST",
      headers: {
        "Authorization": `ApiKey ${secrets.meerkat}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "address": `${address}`,
        "currency": "ETH",
        "callback": `https://serene-waters-65951.herokuapp.com/hook/addressActivity/${address}`
      })
    }).then((response) => {
      console.log('meerkat start response:');
      console.log(response);
      return response.text().then(id => this.subscriptionId = id);
    });
  }

  stopWatching() {
    this.socket.close();
    this.done = true;
    fetch(`https://meerkat.watch/api/v0/enterprise/unsubscribe/address/${this.subscriptionId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `ApiKey ${secrets.meerkat}`,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      console.log('meerkat stop response:');
      console.log(response);
      this.props.doneWatching();
    });
  }
}

export default WatchAddress;
