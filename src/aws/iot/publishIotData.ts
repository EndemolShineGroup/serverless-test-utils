import AWS from 'aws-sdk';

const iot = new AWS.Iot();

export default async (topic: string, message: string) => {
  const describeEndpointResponse = await iot.describeEndpoint().promise();
  const IotData = new AWS.IotData({
    endpoint: describeEndpointResponse.endpointAddress,
  });

  const params = {
    payload: new Buffer(message),
    topic,
  };

  return IotData.publish(params).promise();
};
