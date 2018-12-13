import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import EtherInput from '../components/EtherInput';
import HexInput from '../components/HexInput';
import TextField from '@material-ui/core/TextField';

interface Props {
}

interface State {
  nonce: string;
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,
}

export default class TransactionBuilder extends Component <Props, State> {
  state = {
    nonce: '0',
    gasPrice: '4000000000',
    gasLimit: '50000',
    to: '',
    value: '0',
    data: '',
  };

  getJson() {
    return JSON.stringify(this.state);
  }

  render() {
    const { nonce, gasPrice, gasLimit, to, value, data } = this.state;

    const json = this.getJson();

    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Transaction Builder & Signer
          </Typography>
          <TextField
            value={nonce}
            type="number"
            label="Nonce"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ nonce: e.target.value })}
          />
          <EtherInput
            label="Gas Price"
            defaultUnit="gwei"
            value={gasPrice}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ nonce: e.target.value })}
          />
          <TextField
            value={gasLimit}
            type="number"
            label="Nonce"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ gasLimit: e.target.value })}
          />
          <TextField
            value={to}
            label="To"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ to: e.target.value })}
          />
          <EtherInput
            label="Value"
            defaultUnit="ether"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ value: e.target.value })}
          />
          <HexInput
            label="Data"
            value={data}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: e.target.value })}
          />

          <pre>{json}</pre>
        </CardContent>
      </Card>
    );
  }
}
