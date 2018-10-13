import AWS from 'aws-sdk';

export default async (userPoolName: string) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const params = {
    MaxResults: 50,
  };

  const listUserPoolsResponse = await cognito.listUserPools(params).promise();
  if (!listUserPoolsResponse || !listUserPoolsResponse.UserPools) {
    return false;
  }

  const retrievedUserPool = listUserPoolsResponse.UserPools.find((userPool) => {
    return RegExp(userPoolName, 'g').test(userPool.Name as string);
  });

  if (!retrievedUserPool) {
    throw new Error(`Unable to find Cognito User Pool ${userPoolName}`);
  }

  return retrievedUserPool.Id;
};
