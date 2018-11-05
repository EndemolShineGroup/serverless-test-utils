import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import createCognitoUser from './createCognitoUser';

describe('#createCognitoUser', () => {
  beforeAll(() => {
    MockAWS.mock(
      'CognitoIdentityServiceProvider',
      'adminCreateUser',
      (params: any, callback: Function) => {
        callback(null, {
          User: {
            Username: params.Username,
          },
        });
      },
    );
  });

  afterAll(() => {
    MockAWS.restore('CognitoIdentityServiceProvider');
  });

  it('creates a user in a Cognito User Pool', async () => {
    const userName = 'testUser';
    const result = await createCognitoUser('myUserPool', userName, 'hunter2');
    expect(result.User!.Username).toEqual(userName);
  });
});
