import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import FunctionSignature from './cards/FunctionSignature';
import TransactionBuilder from './cards/TransactionBuilder';

const styles = {
  app: {
    margin: '16px',
  },
};

const App = ({ classes }: { classes: any }) => (
  <div className={classes.app}>
    <Grid container spacing={16}>
      <Grid item md={8}>
        <TransactionBuilder />
      </Grid>
      <Grid item md={4}>
        <FunctionSignature />
      </Grid>
    </Grid>
  </div>
);

export default withStyles(styles)(App);
