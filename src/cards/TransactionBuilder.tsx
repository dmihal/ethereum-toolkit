import React, { Component } from 'react';
import EthereumTX from 'ethereumjs-tx';
import ethereumUtils from 'ethereumjs-util';
import Web3 from 'web3';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import EtherInput from '../components/EtherInput';
import HexInput from '../components/HexInput';
import TextField from '@material-ui/core/TextField';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


interface Props {
}

interface State {
  nonce: string;
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,

  signerExpanded: boolean,

  privateKey: string,
}

const PRIVATE_KEY_REGEX = /[0-9a-fA-F]{64}/;

export default class TransactionBuilder extends Component <Props, State> {
  state = {
    nonce: '0',
    gasPrice: '4000000000',
    gasLimit: '50000',
    to: '',
    value: '0',
    data: '',

    signerExpanded: false,

    privateKey: '',
  };

  web3 = new Web3();

  getTxObj() {
    const { nonce, gasPrice, gasLimit, to, value, data, privateKey } = this.state;
    return {
      nonce: this.web3.utils.toHex(nonce),
      gasPrice: this.web3.utils.toHex(gasPrice),
      gasLimit: this.web3.utils.toHex(gasLimit),
      to,
      value: this.web3.utils.toHex(value),
      data,
    };
  }

  getSigned() {
    if (PRIVATE_KEY_REGEX.test(this.state.privateKey)) {
      const tx = new EthereumTX(this.getTxObj());
      tx.sign(Buffer.from(this.state.privateKey, 'hex'));
      const raw = '0x' + tx.serialize().toString('hex');
      return raw;
    }
    return '';
  }

  render() {
    const { nonce, gasPrice, gasLimit, to, value, data, signerExpanded, privateKey } = this.state;

    const txObject = this.getTxObj();

    let signed = '';
    let error = null;
    try {
      signed = signerExpanded ? this.getSigned() : '';
    } catch (e) {
      error = e.message;
    }

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
            onChange={(val: string) => this.setState({ gasPrice: val })}
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
            onChange={(val: string) => this.setState({ value: val })}
          />
          <HexInput
            label="Data"
            value={data}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ data: e.target.value })}
          />

          <Typography>{error}</Typography>
          <pre>{JSON.stringify(txObject)}</pre>
        </CardContent>

        <CardActions disableActionSpacing>
          <Button fullWidth={true} onClick={(e) => this.setState({ signerExpanded: !signerExpanded })}>
            <ExpandMoreIcon /> Sign Transaction
          </Button>
        </CardActions>

        <Collapse in={signerExpanded} timeout="auto" unmountOnExit>
          <CardContent>
            <HexInput
              label="Private Key"
              value={privateKey}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ privateKey: e.target.value })}
            />
            <pre>{signed}</pre>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}
