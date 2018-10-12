import React, { Component } from 'react';
import { ESUtils } from './elasticsearch-util';
import { Chart } from "react-google-charts";
import { DateTime } from 'react-datetime'
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

  generateLinearDataSource(esData) {
    let array = [["x"]];

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

  generateTableDataSource(esData) {
    let array = [[{type: 'string', label: 'Transaction'}]];
    
    for(let i=0; i < esData.aggregations.transaction.buckets.length; i++) {
      const transaction = esData.aggregations.transaction.buckets[i];
      for(let j=0; j < transaction.percentiles.values.length; j++) {
        const percentile = transaction.percentiles.values[j];
        if(j===0)
          array.push([transaction.key]);
        if(i===0)
          array[0].push({type: 'number', label: percentile.key});
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
        const response = await es.getPercentiles(this.state.index, this.state.timeFrom * 1000, this.state.timeTo * 1000);
        this.handleDataSource('linearDataSource', this.generateLinearDataSource(response));
        this.handleDataSource('tableDataSource', this.generateTableDataSource(response));
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
            <input type="text" name="esHost" onChange={this.handleChange} placeholder="localhost" />
            <input type="number" name="esPort" onChange={this.handleChange} placeholder="9200" />
            <input type="number" name="timeFrom" onChange={this.handleChange} placeholder="from" />
            <input type="number" name="timeTo" onChange={this.handleChange} placeholder="to" />
            <input type="text" name="index" onChange={this.handleChange} placeholder="index" />
            <input type="submit" />
          </form>
        </div>
        <div id="charts">
          <Chart
            chartType="LineChart"
            loader={<div>Loading percentile distribution...</div>}
            data={this.state.linearDataSource}
            options={{
              chartArea: {
                width: '80%',
              },
              hAxis: {
                title: 'Percentile',
              },
              vAxis: {
                title: 'Response time in milliseconds (ms)',
              },
              title: `Response time percentile distribution for ${this.state.index}`,
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
