import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import publishSnsMessage from './publishSnsMessage';

const LIST_TOPICS_FIXTURE = {
  Topics: [
    {
      TopicArn: 'arn:aws:sns:*:123456789012:myTopic',
    },
  ],
};

const PUBLISH_FIXTURE = {
  MessageId: '1',
};

describe('publishSnsMessage', () => {
  beforeAll(() => {
    MockAWS.mock('SNS', 'listTopics', (callback: Function) => {
      callback(null, LIST_TOPICS_FIXTURE);
    });
    MockAWS.mock('SNS', 'publish', (params: any, callback: Function) => {
      callback(null, PUBLISH_FIXTURE);
    });
  });

  afterAll(() => {
    MockAWS.restore('SNS');
  });

  it('publishes a message to an SNS topic', async () => {
    const result = await publishSnsMessage('myTopic', 'hello world');
    expect(result).toEqual(PUBLISH_FIXTURE);
  });
});
