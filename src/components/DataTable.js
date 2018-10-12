import React, { Component } from 'react';
import { Chart } from "react-google-charts";

class DataTable extends Component {
  /*
    Default properties
    - dataSource: Data source -> Updated on-submit via the parent
  */

  render() {
    return(
      <Chart
        width={'100%'}
        height={'500px'}
        chartType="Table"
        loader={<div>Loading data table</div>}
        data={this.props.dataSource}
      />
    );
  }
}

export default DataTable;