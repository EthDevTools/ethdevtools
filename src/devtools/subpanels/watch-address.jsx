import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import secrets from '../../secrets.json';
import MessageTable from './MessageTable.jsx';

const dummy = JSON.parse(`{"headers":{"Accept":"application/json","Connect-Time":"0","Connection":"close","Content-Length":"480","Content-Type":"application/json","Total-Route-Time":"0","Via":"1.1 vegur","X-Forwarded-For":"34.215.107.187","X-Forwarded-Port":"443","X-Forwarded-Proto":"https","X-Request-Id":"034c10fc-8ee7-4fb4-a9d1-e1dd925bccd5","X-Request-Start":"1550375346392"},"endpoint":"/addressActivity/0xeF42cF85bE6aDf3081aDA73aF87e27996046fE63","data":{"address":"0xeF42cF85bE6aDf3081aDA73aF87e27996046fE63","amount":"0.000126000000000000","blockHeight":7230352,"confirmedBalance":"0.885907833630011692","currency":"ETH","erc20Data":null,"error":null,"event":"confirmed","inputs":["0xeF42cF85bE6aDf3081aDA73aF87e27996046fE63"],"isGas":false,"outputs":["0xeF42cF85bE6aDf3081aDA73aF87e27996046fE63"],"risk":0,"timestamp":"2019-02-17T03:38:51Z","txid":"0x9e16a85c2dcc9c7c3cbb1873dd0863bffe529ac2e436a5dd4f903aeeff86d955","type":"sent"}}
`);

class WatchAddress extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      messages: []
    };
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
      <MessageTable messages={this.state.messages} />
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
    const address = this.props.address;
    this.socket = new WebSocket(`ws://serene-waters-65951.herokuapp.com/socket/addressActivity/${address}`);
    this.socket.onmessage = (event) => {
      console.log("New socket message received");
      console.log(event.data);
      console.log("Coercing");
      const newMessage = JSON.parse(event.data);
      console.log(newMessage);
      const messages = this.state.messages.concat(newMessage);
      console.log("added to state, resetting state");
      this.setState({ messages });
    };
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
