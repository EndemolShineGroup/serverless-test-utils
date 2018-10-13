import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import listStackOutputs from './listStackOutputs';

describe('listStackOutputs', () => {
  beforeAll(() => {
    MockAWS.mock(
      'CloudFormation',
      'describeStacks',
      (params: any, callback: Function) => {
        callback(null, {
          Stacks: [
            {
              Outputs: [
                {
                  OutputKey: 'Foo',
                  OutputValue: 'Bar',
                },
              ],
              StackName: 'serverless-test-utils',
            },
          ],
        });
      },
    );
  });

  afterAll(() => {
    MockAWS.restore('CloudFormation');
  });

  it('returns the outputs for a given stack', async () => {
    const outputs = await listStackOutputs('serverless-test-utils');
    expect(outputs).toEqual([
      {
        OutputKey: 'Foo',
        OutputValue: 'Bar',
      },
    ]);
  });
});
