import { execSync } from 'child_process';

import serverlessExec from './serverlessExec';

export default (functionName: string) => {
  const logs = execSync(
    `${serverlessExec} logs --function ${functionName} --noGreeting true`,
  ).toString('utf8');
  const logsString = new Buffer(logs, 'base64').toString();
  process.stdout.write(logsString);
  return logsString;
};
