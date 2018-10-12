import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';

export class TimeConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFrom: 0,
      timeTo: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    // use of callback to make sure the state has been set before calling parent component
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.props.handleChildState(this.state);
    }); 
  }

  render() {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Time</FormLabel>
        <TextField
          name="timeFrom"
          label="From"
          type="datetime-local"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          name="timeTo"
          label="To"
          type="datetime-local"
          onChange={this.handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </FormControl> 
    );
  }
}

export default TimeConfig;