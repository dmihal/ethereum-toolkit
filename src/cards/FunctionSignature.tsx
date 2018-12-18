import React, { Component } from 'react';
import ethereumUtils from 'ethereumjs-util';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowUpward from '@material-ui/icons/ArrowUpward';

const FUNCTION_SIGNATURE_REGEX = /^\W\([\W, ].\)$/;


interface Props {
}

interface State {
  fnInterface: string,
  signature: string,

  decodeErr: string | null,
}

interface ByteQueryResult {
  text_signature: string,
}

export default class FunctionSignature extends Component <Props, State> {
  state = {
    fnInterface: '',
    signature: '',
    decodeErr: null,
  }

  async encode() {
    const { keccak256, bufferToHex } = ethereumUtils;
    const signature = bufferToHex(keccak256(this.state.fnInterface)).substr(0, 10);
    this.setState({ signature, decodeErr: null });
  }

  async decode() {
    const response = await fetch(`https://www.4byte.directory/api/v1/signatures/?hex_signature=${this.state.signature}`);
    const { count, results } = await response.json();
    if (count === 0) {
      this.setState({ decodeErr: 'Signature not found' });
    } else {
      this.setState({ fnInterface: results[0].text_signature, decodeErr: null });
    }
  }

  render() {
    const { fnInterface, signature, decodeErr } = this.state;
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            EVM Function Signatures
          </Typography>

          <Grid>
            <TextField
              value={fnInterface}
              fullWidth
              placeholder="Function signature"
              onChange={(e) => this.setState({ fnInterface: e.target.value })}
            />
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <div style={{ textAlign: 'center' }}>
                <Fab variant="extended" disabled={fnInterface.length < 3} onClick={() => this.encode()}>
                  <ArrowDownward />
                  Encode
                </Fab>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div style={{ textAlign: 'center' }}>
                <Fab variant="extended" disabled={signature.length < 8} onClick={() => this.decode()}>
                  <ArrowUpward />
                  Decode
                </Fab>
                <Typography>
                  Uses <a href="https://www.4byte.directory/" target="4byte">4byte.directory</a>
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Grid>
            <TextField
              value={signature}
              fullWidth
              placeholder="4-byte hex signature"
              inputProps={{ maxLength: 10 }}
              onChange={(e) => this.setState({ signature: e.target.value })}
            />
            <Typography>{decodeErr}</Typography>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
