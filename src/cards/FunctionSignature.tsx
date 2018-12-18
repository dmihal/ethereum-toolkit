import React, { Component } from 'react';
import ethereumUtils from 'ethereumjs-util';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const FUNCTION_SIGNATURE_REGEX = /^\W\([\W, ].\)$/;


interface Props {
}

interface State {
  fnInterface: string,
  signature: string,
}

interface ByteQueryResult {
  text_signature: string,
}

export default class FunctionSignature extends Component <Props, State> {
  state = {
    fnInterface: '',
    signature: '',
  }

  async encode() {
    const { keccak256, bufferToHex } = ethereumUtils;
    const signature = bufferToHex(keccak256(this.state.fnInterface)).substr(0, 10);
    this.setState({ signature });
  }

  async decode() {
    const response = await fetch(`https://www.4byte.directory/api/v1/signatures/?hex_signature=${this.state.signature}`);
    const { count, results } = await response.json();
    if (count === 0) {
      console.log('Signature not found');
    } else {
      this.setState({ fnInterface: results[0].text_signature });
    }
  }

  render() {
    const { fnInterface, signature } = this.state;
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            EVM Function Signatures
          </Typography>

          <Grid>
            <TextField value={fnInterface} onChange={(e) => this.setState({ fnInterface: e.target.value })} />
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Button onClick={() => this.encode()}>
                Encode
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={() => this.decode()}>
                Decode
              </Button>
              <Typography>
                Uses <a href="https://www.4byte.directory/" target="4byte">4byte.directory</a>
              </Typography>
            </Grid>
          </Grid>
          <Grid>
            <TextField value={signature} onChange={(e) => this.setState({ signature: e.target.value })} />
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
