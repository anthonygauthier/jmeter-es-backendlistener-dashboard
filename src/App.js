import React, { Component } from 'react';
import { ESUtils } from './utils/elasticsearch';
import { ChartUtils } from './utils/charts';
import ElasticConfig from './components/ElasticConfig';
import TimeConfig from './components/TimeConfig';
import LinearChart from './components/LinearChart';
import DataTable from './components/DataTable';
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
          <LinearChart 
            title={(this.state.index !== undefined) && `Percentile distribution for index "${this.state.index}"`}
            subtitle={(this.state.index !== undefined) && 'Response time in millisecond (ms)'}
            xAxisLegend="Percentile"
            yAxisLegend="Response time"
            dataSource={this.state.linearDataSource}
          />
          <DataTable dataSource={this.state.tableDataSource} />
        </div>
      </div>
    );
  }
}

export default App;
