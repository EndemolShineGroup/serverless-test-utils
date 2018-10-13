import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import removeSnsTopic from './removeSnsTopic';

const LIST_TOPICS_FIXTURE = {
  Topics: [
    {
      TopicArn: 'arn:aws:sns:*:123456789012:myTopic',
    },
  ],
};

describe('removeSnsTopic', () => {
  beforeAll(() => {
    MockAWS.mock('SNS', 'listTopics', (callback: Function) => {
      callback(null, LIST_TOPICS_FIXTURE);
    });
    MockAWS.mock('SNS', 'deleteTopic', (params: any, callback: Function) => {
      callback(null, {});
    });
  });

  afterAll(() => {
    MockAWS.restore('SNS');
  });

  it('removes an SNS topic', async () => {
    const result = await removeSnsTopic('myTopic');
    expect(result).toEqual({});
  });
});
