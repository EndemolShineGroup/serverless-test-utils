import path from 'path';

import fse from 'fs-extra';

export default <T extends any>(installDir: string, PluginClass: T) => {
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
};
