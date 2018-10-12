import AWS from 'aws-sdk';

const cloudwatchEvents = new AWS.CloudWatchEvents();

export default (sources: string[]) => {
  const entries = sources.map((source) => {
    return {
      Detail: '{ "key1": "value1" }',
      DetailType: 'serverlessDetailType',
      Source: source,
    };
  });

  const params = {
    Entries: entries,
  };

  return cloudwatchEvents.putEvents(params).promise();
};
