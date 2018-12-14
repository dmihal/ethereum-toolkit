import React, { Component } from 'react';
import Web3 from 'web3';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';

interface Props {
  label: string,
  defaultUnit: string,
  value: string,
  onChange?: (value: string) => any,
}

interface State {
  unit: string | null,
}

export default class EtherInput extends Component <Props, State> {
  web3 = new Web3();

  state = { unit: null };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (!state.unit) {
      state.unit = props.defaultUnit;
    }
    return state;
  }

  render() {
    const unit = this.state.unit || 'ether';
    const { label, value, onChange } = this.props;
    const formattedValue = this.web3.utils.fromWei(value, unit);

    const onChangeWrapper = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const wei = this.web3.utils.toWei(e.target.value, unit);
        onChange(wei);
      }
    };
    return (
      <FormControl>
        <InputLabel>{label}</InputLabel>
        <TextField value={formattedValue} type="number" onChange={onChangeWrapper} />
        <Select value={unit} onChange={e => this.setState({ unit: e.target.value })}>
          <MenuItem value="wei">Wei</MenuItem>
          <MenuItem value="kwei">Kwei</MenuItem>
          <MenuItem value="mwei">Mwei</MenuItem>
          <MenuItem value="gwei">Gwei</MenuItem>
          <MenuItem value="microether">Microether</MenuItem>
          <MenuItem value="milliether">Milliether</MenuItem>
          <MenuItem value="ether">Ether</MenuItem>
        </Select>
      </FormControl>
    );
  }
}
