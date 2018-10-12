import React, { Component } from 'react';
import { Chart } from "react-google-charts";

class LinearChart extends Component {
  /*
    Default properties
    - xAxisLegend: Legend of the horizontal axis
    - yAxisLegend: Legend of the vertical axis
    - title: Title of the graph
    - subtitle: Subtitle of the graph
    - dataSource: Data source -> Updated on-submit via the parent
  */

  render() {
    return(
      <div className="charts">
        <Chart
          chartType="LineChart"
          width={'100%'}
          height={'500px'}
          loader={<div>Waiting for data...</div>}
          data={this.props.dataSource}
          options={{
            hAxis: {
              title: this.props.xAxisLegend,
            },
            vAxis: {
              title: this.props.yAxisLegend,
            },
            title: this.props.title,
            subtitle: this.props.subtitle,
            chart: {
              title: this.props.title,
              subtitle: this.props.subtitle,
            },
            
          }}
        />
      </div>
    );
  }
}

export default LinearChart;