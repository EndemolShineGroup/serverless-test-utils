import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import createAndRemoveInBucket from './createAndRemoveInBucket';

describe('createAndRemoveInBucket', () => {
  beforeAll(() => {
    MockAWS.mock('S3', 'putObject', (params: any, callback: Function) => {
      callback(null, {
        ETag: '111',
      });
    });
    MockAWS.mock('S3', 'deleteObject', (params: any, callback: Function) => {
      callback(null, {});
    });
  });

  afterAll(() => {
    MockAWS.restore('S3');
  });

  it('creates and removes a file in an S3 bucket', async () => {
    const result = await createAndRemoveInBucket('myBucket');
    expect(result).toEqual({});
  });
});
