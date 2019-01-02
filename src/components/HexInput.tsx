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
    inputProps={{
      onKeyDown: (e) => {
        const key = e.keyCode || e.which;
console.log(key, e);
        //back, delete tab, ctrl, win, alt, f5, paste, copy, cut, home, end
        if(key == 8 || key == 46 || key == 9 || key == 17 || key == 91 || key == 18 || 
                key==116 || key == 89 || key == 67 || key == 88 || key == 35 || key == 36) {
            return true;
        }
        // arrows
        if(key >= 37 && key <= 40) {
            return true;
        }
        // numbers key
        if((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
            return true;
        }
        // a-f
        if(key >= 65 && key <= 70) {
            return true;
        }
        e.preventDefault();
      }
    }}
    {...props}
  />
);

export default HexInput;
