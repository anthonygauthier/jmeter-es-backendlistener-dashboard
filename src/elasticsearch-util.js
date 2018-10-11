import elasticsearch from 'elasticsearch';

export class ESUtils {
  constructor(host, port) {
    this.client = new elasticsearch.Client({ host: `${host}:${port}` });
  }

  async checkConnectivity() {
    return await this.client.ping({ requestTimeout: 3000 });
  }

  async getPercentiles(index, timeFrom, timeTo) {
    const response = await this.client.search({
      index: index,
      body: {
        aggs: {
          "transaction": {
            terms: {
              field: "SampleLabel.keyword",
              size: 200,
              order: {
                _key: "desc"
              }
            },
            aggs: {
              "percentiles": {
                percentiles: {
                  field: "ResponseTime",
                  percents: [
                    1,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15,
                    16,
                    17,
                    18,
                    19,
                    20,
                    21,
                    22,
                    23,
                    24,
                    25,
                    26,
                    27,
                    28,
                    29,
                    30,
                    31,
                    32,
                    33,
                    34,
                    35,
                    36,
                    37,
                    38,
                    39,
                    40,
                    41,
                    42,
                    43,
                    44,
                    45,
                    46,
                    47,
                    48,
                    49,
                    50,
                    51,
                    52,
                    53,
                    54,
                    55,
                    56,
                    57,
                    58,
                    59,
                    60,
                    61,
                    62,
                    63,
                    64,
                    65,
                    66,
                    67,
                    68,
                    69,
                    70,
                    71,
                    72,
                    73,
                    74,
                    75,
                    76,
                    77,
                    78,
                    79,
                    80,
                    81,
                    82,
                    83,
                    84,
                    85,
                    86,
                    87,
                    88,
                    89,
                    90,
                    91,
                    92,
                    93,
                    94,
                    95,
                    96,
                    97,
                    98,
                    99,
                    100
                  ],
                  keyed: false
                }
              }
            }
          }
        },
        docvalue_fields: ["ElapsedTime", "EndTime", "StartTime", "Timestamp"],
        query: {
          bool: {
            must: [{
              range: {
                Timestamp: {
                  gte: timeFrom * 1000,
                  lte: timeTo * 1000,
                  format: "epoch_millis"
                }
              }
            }]
          }
        }
      }
    });

    return response;
  }
}