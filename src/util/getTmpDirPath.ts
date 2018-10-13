import crypto from 'crypto';
import os from 'os';
import path from 'path';

export default () => {
  return path.join(
    os.tmpdir(),
    'tmpdirs-serverless',
    'serverless',
    crypto.randomBytes(8).toString('hex'),
  );
};
