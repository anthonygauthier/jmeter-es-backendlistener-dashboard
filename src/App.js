import React, { Component } from 'react';
import { ESUtils } from './utils/elasticsearch';
import { ChartUtils } from './utils/charts';
import { Chart } from "react-google-charts";
import { ElasticConfig } from './components/ElasticConfig';
import { TimeConfig } from './components/TimeConfig';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linearDataSource: null,
      tableDataSource: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChildState = this.handleChildState.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDataSource(name, value) {
    this.setState({[name]: value});
  }

  handleChildState(configs) {
    for(let prop in configs) {
      this.setState({[prop]: configs[prop]});
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const es = new ESUtils(this.state.esHost, this.state.esPort);

    try {
      if(await es.checkConnectivity()) {
        const response = await es.getPercentiles(this.state.index, new Date(this.state.timeFrom).getTime(), new Date(this.state.timeTo).getTime());
        this.handleDataSource('linearDataSource', new ChartUtils(response).generatePercentileLinearDataSource());
        this.handleDataSource('tableDataSource', new ChartUtils(response).generatePercentileTableDataSource());
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
                <ElasticConfig handleChildState={this.handleChildState} />
              </Grid>
              <Grid item xs={6}>
                <TimeConfig handleChildState={this.handleChildState} />
              </Grid>
            </Grid>
            <Button type="submit" variant="contained" color="primary">Refresh</Button>
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
