import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const Radios = ({ value, onChange, label, options, disabled }:
    { value: string, onChange: (value: string) => any, label: string, options: string[], disabled: boolean | undefined }) => (
  <FormControl component={'fieldset' as 'div'}>
    <FormLabel component={'legend' as 'label'}>{label}</FormLabel>
    <RadioGroup
      value={value}
      onChange={(event, value) => onChange(value)}
    >
      {options.map(option => (
        <FormControlLabel value={option} control={<Radio />} label={option} key={option} disabled={disabled} />
      ))}
    </RadioGroup>
  </FormControl>
);

export default Radios;
