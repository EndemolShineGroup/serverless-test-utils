import AWS from 'aws-sdk';

const sns = new AWS.SNS();

export default async (topicName: string) => {
  const params = {
    Name: topicName,
  };

  return sns.createTopic(params).promise();
};
