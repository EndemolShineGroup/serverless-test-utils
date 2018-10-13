import listStackOutputs from './aws/cloudFormation/listStackOutputs';
import putCloudWatchEvents from './aws/cloudWatch/putCloudWatchEvents';
import createCognitoUser from './aws/cognitoUserPool/createCognitoUser';
import getCognitoUserPoolId from './aws/cognitoUserPool/getCognitoUserPoolId';
import publishIotData from './aws/iot/publishIotData';
import createAndRemoveInBucket from './aws/s3/createAndRemoveInBucket';
import createSnsTopic from './aws/sns/createSnsTopic';
import publishSnsMessage from './aws/sns/publishSnsMessage';
import removeSnsTopic from './aws/sns/removeSnsTopic';
import createTestService from './serverless/createTestService';
import deployService from './serverless/deployService';
import getFunctionLogs from './serverless/getFunctionLogs';
import installPlugin from './serverless/installPlugin';
import removeService from './serverless/removeService';
import serverlessExec from './serverless/serverlessExec';
import getTmpDirPath from './util/getTmpDirPath';
import getTmpFilePath from './util/getTmpFilePath';
import replaceTextInFile from './util/replaceTextInFile';
import sleep from './util/sleep';

// mock to test functionality bound to a serverless plugin
class ServerlessPlugin {
  constructor(
    protected serverless: any,
    protected options: any,
    testSubject: any,
  ) {
    Object.assign(this, testSubject);
  }
}

export = {
  getTmpDirPath,
  getTmpFilePath,
  replaceTextInFile,
  serverlessExec,

  listStackOutputs,

  putCloudWatchEvents,

  createCognitoUser,
  getCognitoUserPoolId,

  publishIotData,

  createAndRemoveInBucket,

  createSnsTopic,
  publishSnsMessage,
  removeSnsTopic,

  sleep,

  ServerlessPlugin,

  createTestService,

  installPlugin,

  getFunctionLogs,

  deployService,
  removeService,
};
