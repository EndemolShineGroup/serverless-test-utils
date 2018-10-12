import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export default async (
  userPoolId: string,
  username: string,
  password: string,
) => {
  const params = {
    TemporaryPassword: password,
    UserPoolId: userPoolId,
    Username: username,
  };
  return cognito.adminCreateUser(params).promise();
};
