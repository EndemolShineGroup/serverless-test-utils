import { execSync } from 'child_process';
import crypto from 'crypto';
import os from 'os';
import path from 'path';

import fse from 'fs-extra';
import yaml from 'js-yaml';

import replaceTextInFile from '../util/replaceTextInFile';
import serverlessExec from './serverlessExec';

export default (
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
};
