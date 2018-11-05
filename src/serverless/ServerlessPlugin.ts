import Serverless from 'serverless';

// mock to test functionality bound to a serverless plugin
export default class ServerlessPlugin {
  constructor(
    public serverless: Serverless,
    public options: any,
    testSubject: any,
  ) {
    Object.assign(this, testSubject);
  }
}
