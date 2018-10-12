import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';

class ElasticConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      esHost: 'localhost',
      esPort: 9200,
      index: ''
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
        <FormLabel component="legend">ElasticSearch Config</FormLabel>
        <Input className="input" type="text" label="ElasticSearch Host" name="esHost" placeholder="localhost" onChange={this.handleChange} />
        <Input type="number" name="esPort" onChange={this.handleChange} placeholder="9200" />
        <Input type="text" name="index" onChange={this.handleChange} placeholder="index" />
      </FormControl>
    );
  }
}

export default ElasticConfig;