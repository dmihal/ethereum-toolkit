import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import HexInput from '../components/HexInput';
import VanityWorker, { WebpackWorker } from '../workers/vanity.worker';

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

  worker: WebpackWorker | null = null;

  start() {
    this.setState({ isRunning: true });
    this.worker = new VanityWorker();
    this.worker.postMessage({ command: 'start' });
  }

  stop() {
    this.setState({ isRunning: false });
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
