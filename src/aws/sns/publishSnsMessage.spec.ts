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

describe('#publishSnsMessage', () => {
  const TOPIC_NAME = 'myTopic';

  describe('when the message is successfully published', () => {
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
      const result = await publishSnsMessage(TOPIC_NAME, 'hello world');
      expect(result).toEqual(PUBLISH_FIXTURE);
    });
  });

  describe('when no topics are found', () => {
    beforeAll(() => {
      MockAWS.mock('SNS', 'listTopics', (callback: Function) => {
        callback(null, {});
      });
    });

    afterAll(() => {
      MockAWS.restore('SNS');
    });

    it('throws an error', async () => {
      try {
        await publishSnsMessage(TOPIC_NAME, 'hello world');
      } catch (error) {
        expect(error.message).toMatch(`No topics found`);
      }
    });
  });

  describe('when the topic name is not found', () => {
    beforeAll(() => {
      MockAWS.mock('SNS', 'listTopics', (callback: Function) => {
        callback(null, {
          Topics: [],
        });
      });
    });

    afterAll(() => {
      MockAWS.restore('SNS');
    });

    it('throws an error', async () => {
      try {
        await publishSnsMessage(TOPIC_NAME, 'hello world');
      } catch (error) {
        expect(error.message).toMatch(`Unable to find SNS Topic ${TOPIC_NAME}`);
      }
    });
  });
});
