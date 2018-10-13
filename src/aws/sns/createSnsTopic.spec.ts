import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import createSnsTopic from './createSnsTopic';

const FIXTURE = {
  TopicArn: 'arn:aws:sns:*:123456789012:myTopic',
};

describe('createSnsTopic', () => {
  beforeAll(() => {
    MockAWS.mock('SNS', 'createTopic', (params: any, callback: Function) => {
      callback(null, FIXTURE);
    });
  });

  afterAll(() => {
    MockAWS.restore('SNS');
  });

  it('creates an SNS topic', async () => {
    const result = await createSnsTopic('myTopic');
    expect(result).toEqual(FIXTURE);
  });
});
