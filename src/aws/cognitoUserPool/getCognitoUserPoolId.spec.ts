import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import getCognitoUserPoolId from './getCognitoUserPoolId';

const USER_POOL_FIXTURE = {
  Id: '1',
  Name: 'myUserPool',
};

describe('#getCognitoUserPoolId', () => {
  describe('when a user pool is successfully retrieved', () => {
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

    it(`returns the user pool's ID`, async () => {
      const result = await getCognitoUserPoolId(USER_POOL_FIXTURE.Name);
      expect(result).toEqual(USER_POOL_FIXTURE.Id);
    });
  });

  describe('when no user pools are found', () => {
    beforeAll(() => {
      MockAWS.mock(
        'CognitoIdentityServiceProvider',
        'listUserPools',
        (params: any, callback: Function) => {
          callback(null, {});
        },
      );
    });

    afterAll(() => {
      MockAWS.restore('CognitoIdentityServiceProvider');
    });

    it('returns false', async () => {
      const result = await getCognitoUserPoolId(USER_POOL_FIXTURE.Name);
      expect(result).toBeFalsy();
    });
  });

  describe('when the user pool is not found', () => {
    beforeAll(() => {
      MockAWS.mock(
        'CognitoIdentityServiceProvider',
        'listUserPools',
        (params: any, callback: Function) => {
          callback(null, {
            UserPools: [],
          });
        },
      );
    });

    afterAll(() => {
      MockAWS.restore('CognitoIdentityServiceProvider');
    });

    it('throws an error', async () => {
      try {
        await getCognitoUserPoolId(USER_POOL_FIXTURE.Name);
      } catch (error) {
        expect(error.message).toMatch(
          `Unable to find Cognito User Pool ${USER_POOL_FIXTURE.Name}`,
        );
      }
    });
  });
});
