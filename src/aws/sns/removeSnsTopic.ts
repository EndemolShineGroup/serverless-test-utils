import AWS from 'aws-sdk';

export default async (topicName: string, region = 'us-east-1') => {
  const sns = new AWS.SNS({ region });

  const listTopicsResponse = await sns.listTopics().promise();
  if (!listTopicsResponse || !listTopicsResponse.Topics) {
    throw new Error('No topics found');
  }

  const topic = listTopicsResponse.Topics.find((retrievedTopic) => {
    return RegExp(topicName, 'g').test(retrievedTopic.TopicArn as string);
  });

  if (!topic) {
    throw new Error(`Unable to find SNS Topic ${topicName}`);
  }

  const params = {
    TopicArn: topic.TopicArn as string,
  };

  return sns.deleteTopic(params).promise();
};
