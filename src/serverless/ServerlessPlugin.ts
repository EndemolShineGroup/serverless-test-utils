// mock to test functionality bound to a serverless plugin
export default class ServerlessPlugin {
  constructor(public serverless: any, public options: any, testSubject: any) {
    Object.assign(this, testSubject);
  }
}
