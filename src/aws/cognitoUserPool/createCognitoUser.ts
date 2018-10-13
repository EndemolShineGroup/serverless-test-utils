import AWS from 'aws-sdk';

export default async (
  userPoolId: string,
  username: string,
  password: string,
) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const params = {
    TemporaryPassword: password,
    UserPoolId: userPoolId,
    Username: username,
  };
  return cognito.adminCreateUser(params).promise();
};
