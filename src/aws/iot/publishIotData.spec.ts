import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import publishIotData from './publishIotData';

describe('publishIotData', () => {
  beforeAll(() => {
    MockAWS.mock('Iot', 'describeEndpoint', (callback: Function) => {
      callback(null, {
        endpointAddress: 'https://google.com',
      });
    });
    MockAWS.mock('IotData', 'publish', (params: any, callback: Function) => {
      callback(null, {});
    });
  });

  afterAll(() => {
    MockAWS.restore('Iot');
    MockAWS.restore('IotData');
  });

  it('publishes a message to an IoT topic', async () => {
    const result = await publishIotData('iotTopic', 'hello world');
    expect(result).toEqual({});
  });
});
