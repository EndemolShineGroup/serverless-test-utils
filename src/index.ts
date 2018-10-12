import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
const execSync = require('child_process').execSync;

import AWS from 'aws-sdk';
const fse = require('fs-extra');

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

const serverlessExec = require.resolve('serverless/bin/serverless');

const getTmpDirPath = () => {
  return path.join(
    os.tmpdir(),
    'tmpdirs-serverless',
    'serverless',
    crypto.randomBytes(8).toString('hex'),
  );
};

const getTmpFilePath = (fileName: string) => {
  return path.join(getTmpDirPath(), fileName);
};

const replaceTextInFile = (
  filePath: string,
  subString: string,
  newSubString: string,
) => {
  const fileContent = fs.readFileSync(filePath).toString();
  fs.writeFileSync(filePath, fileContent.replace(subString, newSubString));
};

export = {
  getTmpDirPath,
  getTmpFilePath,
  replaceTextInFile,
  serverlessExec,

  ServerlessPlugin,

  createTestService: (
    templateName: string,
    testServiceDir: string,
    testStage = 'dev',
  ) => {
    const hrtime = process.hrtime();
    const serviceName = `test-${hrtime[0]}-${hrtime[1]}`;
    const tmpDir = path.join(
      os.tmpdir(),
      'tmpdirs-serverless',
      'integration-test-suite',
      crypto.randomBytes(8).toString('hex'),
    );

    fse.mkdirsSync(tmpDir);
    process.chdir(tmpDir);

    // create a new Serverless service
    execSync(`${serverlessExec} create --template ${templateName}`, {
      stdio: 'inherit',
    });

    if (testServiceDir) {
      fse.copySync(testServiceDir, tmpDir, {
        clobber: true,
        preserveTimestamps: true,
      });
    }

    replaceTextInFile('serverless.yml', templateName, serviceName);

    process.env.TOPIC_1 = `${serviceName}-1`;
    process.env.TOPIC_2 = `${serviceName}-1`;
    process.env.BUCKET_1 = `${serviceName}-1`;
    process.env.BUCKET_2 = `${serviceName}-2`;
    process.env.COGNITO_USER_POOL_1 = `${serviceName}-1`;
    process.env.COGNITO_USER_POOL_2 = `${serviceName}-2`;

    // return the name of the CloudFormation stack
    return `${serviceName}-${testStage}`;
  },

  createAndRemoveInBucket(bucketName: string) {
    const S3 = new AWS.S3({ region: 'us-east-1' });

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
  },

  createSnsTopic(topicName: string) {
    const SNS = new AWS.SNS({ region: 'us-east-1' });

    const params = {
      Name: topicName,
    };

    return SNS.createTopic(params).promise();
  },

  installPlugin: <T extends any>(installDir: string, PluginClass: T) => {
    const pluginPkg = { name: path.basename(installDir), version: '0.0.0' };
    const className = new PluginClass().constructor.name;
    fse.outputFileSync(
      path.join(installDir, 'package.json'),
      JSON.stringify(pluginPkg),
      'utf8',
    );
    fse.outputFileSync(
      path.join(installDir, 'index.js'),
      `"use strict";\n${PluginClass.toString()}\nmodule.exports = ${className}`,
      'utf8',
    );
  },

  async removeSnsTopic(topicName: string) {
    const SNS = new AWS.SNS({ region: 'us-east-1' });

    const listTopicsResponse = await SNS.listTopics().promise();
    if (!listTopicsResponse || !listTopicsResponse.Topics) {
      throw new Error('No topics found');
    }

    const topic = listTopicsResponse.Topics.find((retrievedTopic) => {
      return RegExp(topicName, 'g').test(retrievedTopic.TopicArn as string);
    });

    const params = {
      TopicArn: topic!.TopicArn as string,
    };

    return SNS.deleteTopic(params).promise();
  },

  async publishSnsMessage(topicName: string, message: string) {
    const SNS = new AWS.SNS({ region: 'us-east-1' });

    const listTopicsResponse = await SNS.listTopics().promise();

    if (!listTopicsResponse || !listTopicsResponse.Topics) {
      throw new Error('No topics found');
    }

    const topic = listTopicsResponse.Topics.find((retrievedTopic) => {
      return RegExp(topicName, 'g').test(retrievedTopic.TopicArn as string);
    });

    const params = {
      Message: message,
      TopicArn: topic!.TopicArn,
    };

    return SNS.publish(params).promise();
  },

  async publishIotData(topic: string, message: string) {
    const Iot = new AWS.Iot({ region: 'us-east-1' });

    const describeEndpointResponse = await Iot.describeEndpoint().promise();
    const IotData = new AWS.IotData({
      endpoint: describeEndpointResponse.endpointAddress,
      region: 'us-east-1',
    });

    const params = {
      payload: new Buffer(message),
      topic,
    };

    return IotData.publish(params).promise();
  },

  async putCloudWatchEvents(sources: string[]) {
    const cwe = new AWS.CloudWatchEvents({ region: 'us-east-1' });

    const entries = sources.map((source) => {
      return {
        Detail: '{ "key1": "value1" }',
        DetailType: 'serverlessDetailType',
        Source: source,
      };
    });

    const params = {
      Entries: entries,
    };

    return cwe.putEvents(params).promise();
  },

  async getCognitoUserPoolId(userPoolName: string) {
    const cisp = new AWS.CognitoIdentityServiceProvider({
      region: 'us-east-1',
    });

    const params = {
      MaxResults: 50,
    };

    const listUserPoolsResponse = await cisp.listUserPools(params).promise();
    if (!listUserPoolsResponse || !listUserPoolsResponse.UserPools) {
      return false;
    }

    const retrievedUserPool = listUserPoolsResponse.UserPools.find(
      (userPool) => {
        return RegExp(userPoolName, 'g').test(userPool.Name as string);
      },
    );

    if (!retrievedUserPool) {
      throw new Error(`Unable to find Cognito User Pool ${userPoolName}`);
    }

    return retrievedUserPool.Id;
  },

  createCognitoUser(userPoolId: string, username: string, password: string) {
    const cisp = new AWS.CognitoIdentityServiceProvider({
      region: 'us-east-1',
    });

    const params = {
      TemporaryPassword: password,
      UserPoolId: userPoolId,
      Username: username,
    };
    return cisp.adminCreateUser(params).promise();
  },

  getFunctionLogs(functionName: string) {
    const logs = execSync(
      `${serverlessExec} logs --function ${functionName} --noGreeting true`,
    );
    const logsString = new Buffer(logs, 'base64').toString();
    process.stdout.write(logsString);
    return logsString;
  },

  deployService() {
    execSync(`${serverlessExec} deploy`, { stdio: 'inherit' });
  },

  removeService() {
    execSync(`${serverlessExec} remove`, { stdio: 'inherit' });
  },
};
