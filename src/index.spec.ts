import Serverless from 'serverless';

const testUtils = require('.');

describe('Test utils', () => {
  describe('#getTmpDirPath()', () => {
    it('should return a valid tmpDir path', () => {
      const tmpDirPath = testUtils.getTmpDirPath();

      expect(tmpDirPath).toMatch(/.+.{16}/);
    });
  });

  describe('#getTmpFilePath()', () => {
    it('should return a valid tmpFile path', () => {
      const fileName = 'foo.bar';
      const tmpFilePath = testUtils.getTmpFilePath(fileName);

      expect(tmpFilePath).toMatch(/.+.{16}.{1}foo\.bar/);
    });
  });

  describe('ServerlessPlugin', () => {
    it('should create a new ServerlessPlugin mock instance', () => {
      const ServerlessPlugin = testUtils.ServerlessPlugin;

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
});
