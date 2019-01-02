import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import HexInput from '../components/HexInput';
import Radios from '../components/Radios';
import VanityControl, { SearchParams, AddressType } from '../workers/VanityControl';

interface Props {
}

interface State {
  search: string,
  addressType: AddressType,
  status: string,
  isRunning: boolean,
}

export default class VanityAddress extends Component <Props, State> {
  state = {
    search: '123',
    addressType: 'Account' as AddressType,
    status: '',
    isRunning: false,
  }

  worker: VanityControl | null = null;

  getSearchParams() {
    const { search, addressType } = this.state;
    const searchParams: SearchParams = {
      search,
      addressType,
    };
    return searchParams;
  }

  async start() {
    this.setState({ isRunning: true });

    this.worker = new VanityControl(this.getSearchParams());
    this.worker.onStatus(status => this.setState({ status: `Running, generated ${status.iterations} addresses` }));

    const result = await this.worker.generateAddress();

    let status;
    if (this.state.addressType === 'Contract') {
      status = `Success! Generated contract address 0x${result.address} after ${result.iterations}`
        + ` attempts. Contract should be deployed by 0xaccount ${result.accountAddress} generated `
        + ` with private key ${result.privkey}.`;
    } else {
      status = `Success! Generated address 0x${result.address} after ${result.iterations}`
        + ` attempts. Address generated with private key ${result.privkey}.`;
    }
    this.setState({ status, isRunning: false });
  }

  stop() {
    if (this.worker) {
      this.worker.abort();
      this.worker = null;
      this.setState({ isRunning: false, status: 'Stopped' });
    }
  }

  render() {
    const { status, search, isRunning, addressType } = this.state;
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Vanity Address Generator
          </Typography>
          <div>
            <Radios
              value={addressType}
              onChange={(newType: string) => this.setState({ addressType: newType as AddressType })}
              label="Address type"
              options={['Account', 'Contract']}
              disabled={isRunning}
            />
          </div>
          <HexInput
            label="Begin address with:"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ search: e.target.value })}
            disabled={isRunning}
          />
          <Button onClick={() => isRunning ? this.stop() : this.start()}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          <Typography>{status}</Typography>
        </CardContent>
      </Card>
    );
  }
}
