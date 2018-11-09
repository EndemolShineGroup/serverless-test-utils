import { execSync } from 'child_process';

import serverlessExec from './serverlessExec';

export default () => {
  execSync(`${serverlessExec} deploy`, { stdio: 'inherit' });
};
