export class ChartUtils {
  constructor(d) {
    this.data = d;
  }

  generatePercentileLinearDataSource() {
    let array = [["Percentiles"]];

    for(let i=0; i < this.data.aggregations.transaction.buckets.length; i++) {
      array[0].push(this.data.aggregations.transaction.buckets[i].key)
      for(let j=0; j < this.data.aggregations.transaction.buckets[0].percentiles.values.length; j++) {
        if(i === 0) {
          array.push([]);
          array[j+1].push(this.data.aggregations.transaction.buckets[0].percentiles.values[j].key);
        }
        array[j+1].push(this.data.aggregations.transaction.buckets[i].percentiles.values[j].value);
      }
    }
    return array;
  }

  generatePercentileTableDataSource() {
    let array = [[{type: 'string', label: 'Transaction'}]];
    
    for(let i=0; i < this.data.aggregations.transaction.buckets.length; i++) {
      const transaction = this.data.aggregations.transaction.buckets[i];
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
}