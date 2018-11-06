import React, { Component } from 'react';
import { ESUtils } from './utils/elasticsearch';
import { ChartUtils } from './utils/charts';
import ElasticConfig from './components/ElasticConfig';
import TimeConfig from './components/TimeConfig';
import LinearChart from './components/LinearChart';
import DataTable from './components/DataTable';
import AppMenu from './components/AppMenu';
import { Button, Grid } from '@material-ui/core';
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: teal
  },
  typography: {
    useNextVariants: true,
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appName: 'ElasticSearch Listener Dashboard',
      linearPercentileDataSource: null,
      tablePercentileDataSource: null,
      linearResponseTimeDataSource: null,
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

    // TODO: 
    // Delete before pushing to master
    this.state.esHost = this.state.esHost || 'localhost';
    this.state.esPort = this.state.esPort || 9200;
    this.state.esIndex = this.state.esIndex || 'percentiles';
    this.state.timeFrom = this.state.timeFrom || '2018/10/01, 8:00:00';
    this.state.timeTo = this.state.timeTo || '2018/10/31, 8:00:00';

    const es = new ESUtils(this.state.esHost, this.state.esPort);

    try {
      if(await es.checkConnectivity()) {
        const percentiles = await es.getPercentiles(this.state.index, new Date(this.state.timeFrom).getTime(), new Date(this.state.timeTo).getTime());
        const documents = await es.getDocuments(this.state.index, new Date(this.state.timeFrom).getTime(), new Date(this.state.timeTo).getTime());

        console.log(documents);

        this.handleDataSource('linearPercentileDataSource', new ChartUtils(percentiles).generatePercentileLinearDataSource());
        this.handleDataSource('tablePercentileDataSource', new ChartUtils(percentiles).generatePercentileTableDataSource());
        this.handleDataSource('linearResponseTimeDataSource', new ChartUtils(documents).generateLinearDataSource('Timestamp', 'ResponseTime'));

        console.log(this.state.linearResponseTimeDataSource);
      }
    } catch (e) {
      console.trace(e);
    }     
    
    es.client.close();
  }

  render() {
    return (
      <div className="App">
        <MuiThemeProvider theme={theme}>
          <AppMenu 
            appName={this.state.appName}
          />
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
              dataSource={this.state.linearPercentileDataSource}
            />
            <DataTable dataSource={this.state.tablePercentileDataSource} />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
