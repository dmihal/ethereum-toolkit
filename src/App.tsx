import React, { Component } from 'react';
import FunctionSignature from './cards/FunctionSignature';
import TransactionBuilder from './cards/TransactionBuilder';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TransactionBuilder />
        <FunctionSignature />
      </div>
    );
  }
}

export default App;
