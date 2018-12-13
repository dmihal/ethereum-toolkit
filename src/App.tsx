import React, { Component } from 'react';
import TransactionBuilder from './cards/TransactionBuilder';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TransactionBuilder />
      </div>
    );
  }
}

export default App;
