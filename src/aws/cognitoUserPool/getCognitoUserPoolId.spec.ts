import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import getCognitoUserPoolId from './getCognitoUserPoolId';

const USER_POOL_FIXTURE = {
  Id: '1',
  Name: 'myUserPool',
};

describe('getCognitoUserPoolId', () => {
  beforeAll(() => {
    MockAWS.mock(
      'CognitoIdentityServiceProvider',
      'listUserPools',
      (params: any, callback: Function) => {
        callback(null, {
          UserPools: [USER_POOL_FIXTURE],
        });
      },
    );
  });

  afterAll(() => {
    MockAWS.restore('CognitoIdentityServiceProvider');
  });

  it(`retrieves a Cognito User Pool's ID`, async () => {
    const result = await getCognitoUserPoolId(USER_POOL_FIXTURE.Name);
    expect(result).toEqual(USER_POOL_FIXTURE.Id);
  });
});
