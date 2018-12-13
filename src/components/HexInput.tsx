import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';

const HexInput = ({ ...props }) => (
  <TextField
    label="With normal TextField"
    InputProps={{
      startAdornment: <InputAdornment position="start">0x</InputAdornment>,
    }}
    {...props}
  />
);

export default HexInput;
