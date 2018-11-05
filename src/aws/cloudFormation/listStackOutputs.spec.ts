import AWS from 'aws-sdk';
import MockAWS from 'aws-sdk-mock';

MockAWS.setSDKInstance(AWS);

import listStackOutputs from './listStackOutputs';

describe('#listStackOutputs', () => {
  const STACK_NAME = 'serverless-test-utils';

  describe('when the stack is successfully retrieved', () => {
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
      const outputs = await listStackOutputs(STACK_NAME);
      expect(outputs).toEqual([
        {
          OutputKey: 'Foo',
          OutputValue: 'Bar',
        },
      ]);
    });
  });

  describe('when no stacks are found', () => {
    beforeAll(() => {
      MockAWS.mock(
        'CloudFormation',
        'describeStacks',
        (params: any, callback: Function) => {
          callback(null, {});
        },
      );
    });

    afterAll(() => {
      MockAWS.restore('CloudFormation');
    });

    it('throws an error', async () => {
      try {
        await listStackOutputs(STACK_NAME);
      } catch (error) {
        expect(error.message).toMatch('No stacks found');
      }
    });
  });

  describe('when the stack name is not found', () => {
    beforeAll(() => {
      MockAWS.mock(
        'CloudFormation',
        'describeStacks',
        (params: any, callback: Function) => {
          callback(null, {
            Stacks: [],
          });
        },
      );
    });

    afterAll(() => {
      MockAWS.restore('CloudFormation');
    });

    it('throws an error', async () => {
      try {
        await listStackOutputs(STACK_NAME);
      } catch (error) {
        expect(error.message).toMatch(`No stack found with name ${STACK_NAME}`);
      }
    });
  });
});
