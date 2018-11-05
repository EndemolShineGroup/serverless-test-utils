import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import putCloudWatchEvents from './putCloudWatchEvents';

describe('#putCloudWatchEvents', () => {
  beforeAll(() => {
    MockAWS.mock(
      'CloudWatchEvents',
      'putEvents',
      (params: any, callback: Function) => {
        callback(null, {
          Entries: [{ EventId: '1' }],
        });
      },
    );
  });

  afterAll(() => {
    MockAWS.restore('CloudWatchEvents');
  });

  it('sends an event to CloudWatch', async () => {
    const entries = await putCloudWatchEvents([
      'serverless.testapp1',
      'serverless.testapp2',
    ]);
    expect(entries).toEqual({
      Entries: [{ EventId: '1' }],
    });
  });
});
