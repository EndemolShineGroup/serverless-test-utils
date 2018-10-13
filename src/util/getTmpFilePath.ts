import path from 'path';

import getTmpDirPath from './getTmpDirPath';

export default (fileName: string) => {
  return path.join(getTmpDirPath(), fileName);
};
