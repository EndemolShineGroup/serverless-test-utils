import AWS from 'aws-sdk';

export default async (topicName: string, region = 'us-east-1') => {
  const sns = new AWS.SNS({ region });

  const params = {
    Name: topicName,
  };

  return sns.createTopic(params).promise();
};
