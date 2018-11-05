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

describe('#removeSnsTopic', () => {
  const TOPIC_NAME = 'myTopic';

  describe('when topic is successfully removed', () => {
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

    it('returns an empty object', async () => {
      const result = await removeSnsTopic(TOPIC_NAME);
      expect(result).toEqual({});
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
        await removeSnsTopic(TOPIC_NAME);
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
        await removeSnsTopic(TOPIC_NAME);
      } catch (error) {
        expect(error.message).toMatch(`Unable to find SNS Topic ${TOPIC_NAME}`);
      }
    });
  });
});
