import React, { Component } from 'react';
import { ESUtils } from './elasticsearch-util';
import { Chart } from "react-google-charts";
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      esHost: 'localhost',
      esPort: 9200,
      timeFrom: 0,
      timeTo: 0,
      linearDataSource: null,
      tableDataSource: null,
      index: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  generatePercentileLinearDataSource(esData) {
    let array = [["Percentiles"]];

    for(let i=0; i < esData.aggregations.transaction.buckets.length; i++) {
      array[0].push(esData.aggregations.transaction.buckets[i].key)
      for(let j=0; j < esData.aggregations.transaction.buckets[0].percentiles.values.length; j++) {
        if(i === 0) {
          array.push([]);
          array[j+1].push(esData.aggregations.transaction.buckets[0].percentiles.values[j].key);
        }
        array[j+1].push(esData.aggregations.transaction.buckets[i].percentiles.values[j].value);
      }
    }
    return array;
  }

  generatePercentileTableDataSource(esData) {
    let array = [[{type: 'string', label: 'Transaction'}]];
    
    for(let i=0; i < esData.aggregations.transaction.buckets.length; i++) {
      const transaction = esData.aggregations.transaction.buckets[i];
      for(let j=0; j < transaction.percentiles.values.length; j++) {
        const percentile = transaction.percentiles.values[j];
        if(j===0)
          array.push([transaction.key]);
        if(i===0 && percentile.key % 5 === 0)
          array[0].push({type: 'number', label: percentile.key});
        // to aleviate the table
        if(percentile.key % 5 === 0)
          array[i+1].push(percentile.value)
      }
    }
    return array;
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDataSource(name, value) {
    this.setState({[name]: value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const es = new ESUtils(this.state.esHost, this.state.esPort);

    try {
      if(await es.checkConnectivity()) {
        const response = await es.getPercentiles(this.state.index, new Date(this.state.timeFrom).getTime(), new Date(this.state.timeTo).getTime());
        this.handleDataSource('linearDataSource', this.generatePercentileLinearDataSource(response));
        this.handleDataSource('tableDataSource', this.generatePercentileTableDataSource(response));
      }
    } catch (e) {
      console.trace(e);
    }     
    
    es.client.close();
  }

  render() {
    return (
      <div className="App">
        <div id="forms"> 
          <form onSubmit={this.handleSubmit}>
            <Grid container direction="row" alignItems="center">
              <Grid item xs={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">ElasticSearch Config</FormLabel>
                  <Input className="input" type="text" label="ElasticSearch Host" name="esHost" placeholder="localhost" onChange={this.handleChange} />
                  <Input type="number" name="esPort" onChange={this.handleChange} placeholder="9200" />
                  <Input type="text" name="index" onChange={this.handleChange} placeholder="index" />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
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
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </form>
        </div>
        <div id="charts">
          <Chart
            chartType="Line"
            width={'100%'}
            height={'500px'}
            loader={<div>Waiting for data...</div>}
            data={this.state.linearDataSource}
            options={{
              hAxis: {
                title: 'Percentile',
              },
              vAxis: {
                title: 'Response time (ms)',
              },
              title: `Response time percentile distribution for ${this.state.index}`,
              subtitle: 'Time is in milliseconds (ms)',
              chart: {
                title: `Response time percentile distribution for ${this.state.index}`,
                subtitle: 'Time is in milliseconds (ms)',
              },
              
            }}
          />
          <Chart
            width={'100%'}
            height={'500px'}
            chartType="Table"
            loader={<div>Loading percentile data table</div>}
            data={this.state.tableDataSource}
          />
        </div>
      </div>
    );
  }
}

export default App;
