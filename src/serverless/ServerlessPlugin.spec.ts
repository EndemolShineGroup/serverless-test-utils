import Serverless from 'serverless';

import ServerlessPlugin from './ServerlessPlugin';

describe('ServerlessPlugin', () => {
  it('should create a new ServerlessPlugin mock instance', () => {
    const serverless = new Serverless();
    const options = {
      region: 'my-test-region',
      stage: 'production',
    };
    const functionUnderTest = () => Promise.resolve('function under test');

    const serverlessPlugin = new ServerlessPlugin(
      serverless,
      options,
      functionUnderTest,
    );

    expect(serverlessPlugin.serverless).toBeInstanceOf(Serverless);
    expect(serverlessPlugin.options).toEqual(options);
  });
});
