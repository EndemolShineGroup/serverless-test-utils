import AWS from 'aws-sdk';

/**
 * Use this function to test Lambdas triggered by S3 events
 *
 * @param bucketName
 */
export default (bucketName: string) => {
  const S3 = new AWS.S3();

  const params = {
    Body: 'hello world',
    Bucket: bucketName,
    Key: 'object',
  };

  return S3.putObject(params)
    .promise()
    .then(() => {
      delete params.Body;
      return S3.deleteObject(params).promise();
    });
};
