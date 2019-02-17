import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class MessageTable extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
    };
  }

  render() {
    console.log("rerendering message table");
    console.log(this.props.messages);
    console.log("rerendering message table continue");
    return <div class='message-table'>
      <div class="flex">
        <div class="col amount mx2">Amount</div>
        <div class="col block-height mx2">Block Height</div>
        <div class="col grow-1 mx2">Confirmed Balance</div>
        <div class="col grow-1 mx2">Currency</div>
        <div class="col grow-1 mx2">Event</div>
        <div class="col grow-1 mx2">Inputs</div>
        <div class="col grow-1 mx2">Outputs</div>
        <div class="col grow-1 mx2">Timestamp</div>
        <div class="col grow-1 mx2">Txid</div>
        <div class="col grow-1 mx2">Type</div>
      </div>
      {this.props.messages.map((message, index) => {
        return <div class="flex" key={index}>
            <div class="col amount mx2">{message.data.amount}</div>
            <div class="col block-height mx2">{message.data.blockHeight}</div>
            <div class="col grow-1 mx2">{message.data.confirmedBalance}</div>
            <div class="col grow-1 mx2">{message.data.currency}</div>
            <div class="col grow-1 mx2">{message.data.event}</div>
            <div class="col grow-1 mx2">{JSON.stringify(message.data.inputs)}</div>
            <div class="col grow-1 mx2">{JSON.stringify(message.data.outputs)}</div>
            <div class="col grow-1 mx2">{message.data.timestamp}</div>
            <div class="col grow-1 mx2">{message.data.txid}</div>
            <div class="col grow-1 mx2">{message.data.type}</div>
          </div>
      })}
    </div>
  }
}

export default MessageTable;
