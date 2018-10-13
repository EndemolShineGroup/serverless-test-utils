import AWS from 'aws-sdk';

export default async (topicName: string) => {
  const sns = new AWS.SNS();

  const params = {
    Name: topicName,
  };

  return sns.createTopic(params).promise();
};
