import { execSync } from 'child_process';
import crypto from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';

import fse from 'fs-extra';
import yaml from 'js-yaml';

import listStackOutputs from './aws/cloudFormation/listStackOutputs';
import putCloudWatchEvents from './aws/cloudWatch/putCloudWatchEvents';
import createCognitoUser from './aws/cognitoUserPool/createCognitoUser';
import getCognitoUserPoolId from './aws/cognitoUserPool/getCognitoUserPoolId';
import publishIotData from './aws/iot/publishIotData';
import createAndRemoveInBucket from './aws/s3/createAndRemoveInBucket';
import createSnsTopic from './aws/sns/createSnsTopic';
import publishSnsMessage from './aws/sns/publishSnsMessage';
import removeSnsTopic from './aws/sns/removeSnsTopic';

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

  listStackOutputs,

  putCloudWatchEvents,

  createCognitoUser,
  getCognitoUserPoolId,

  publishIotData,

  createAndRemoveInBucket,

  createSnsTopic,
  publishSnsMessage,
  removeSnsTopic,

  ServerlessPlugin,

  createTestService: (
    templateName: string,
    testServiceDir: string,
    testStage = 'dev',
  ) => {
    const hrtime = process.hrtime();
    const testServiceName = `test-${hrtime[0]}-${hrtime[1]}`;
    const tmpDir = path.join(
      os.tmpdir(),
      'tmpdirs-serverless',
      'integration-test-suite',
      crypto.randomBytes(8).toString('hex'),
    );

    fse.mkdirsSync(tmpDir);
    process.chdir(tmpDir);

    const serverlessConfig = yaml.safeLoad(
      fse
        .readFileSync(path.join(testServiceDir, 'serverless.yml'))
        .toString('utf8'),
    );
    const serviceName = serverlessConfig.service.name;

    // create a new Serverless service
    execSync(`${serverlessExec} create --template ${templateName}`, {
      stdio: 'inherit',
    });

    if (testServiceDir) {
      fse.copySync(testServiceDir, tmpDir, {
        filter: (src: string) => {
          return !(src.includes('.git') || src.includes('.cache'));
        },
        overwrite: true,
        preserveTimestamps: true,
      });
    }

    replaceTextInFile('serverless.yml', serviceName, testServiceName);

    // return the name of the CloudFormation stack
    return `${testServiceName}-${testStage}`;
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

  getFunctionLogs(functionName: string) {
    const logs = execSync(
      `${serverlessExec} logs --function ${functionName} --noGreeting true`,
    ).toString('utf8');
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
