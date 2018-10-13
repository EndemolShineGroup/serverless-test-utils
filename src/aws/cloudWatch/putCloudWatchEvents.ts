import AWS from 'aws-sdk';

export default (sources: string[]) => {
  const cloudwatchEvents = new AWS.CloudWatchEvents();
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
