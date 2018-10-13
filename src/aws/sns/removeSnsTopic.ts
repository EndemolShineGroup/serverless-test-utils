import AWS from 'aws-sdk';

export default async (topicName: string) => {
  const sns = new AWS.SNS();

  const listTopicsResponse = await sns.listTopics().promise();
  if (!listTopicsResponse || !listTopicsResponse.Topics) {
    throw new Error('No topics found');
  }

  const topic = listTopicsResponse.Topics.find((retrievedTopic) => {
    return RegExp(topicName, 'g').test(retrievedTopic.TopicArn as string);
  });

  const params = {
    TopicArn: topic!.TopicArn as string,
  };

  return sns.deleteTopic(params).promise();
};
