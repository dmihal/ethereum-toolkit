import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import HexInput from '../components/HexInput';
import VanityControl from '../workers/VanityControl';

interface Props {
}

interface State {
  search: string,
  status: string,
  isRunning: boolean,
}

export default class VanityAddress extends Component <Props, State> {
  state = {
    search: '',
    status: '',
    isRunning: false,
  }

  worker: VanityControl | null = null;

  async start() {
    this.setState({ isRunning: true });
    this.worker = new VanityControl();
    this.worker.onStatus(status => this.setState({ status: `Running, generated ${status.iterations} addresses` }));

    const result = await this.worker.generateAddress();
    const status = `Success! Generated address 0x${result.address} after ${result.iterations}`
      + ` attempts. Address generated with private key ${result.privkey}.`;
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
    const { status, search, isRunning } = this.state;
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Vanity Address Generator
          </Typography>
          <HexInput
            label="Begin address with:"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.setState({ search: e.target.value })}
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
