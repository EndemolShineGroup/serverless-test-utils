import CloudFormation from 'aws-sdk/clients/cloudformation';

const cloudformation = new CloudFormation();

/**
 * This functions lists any stack outputs
 * @param stackName
 */
export default async (stackName: string) => {
  const response = await cloudformation
    .describeStacks({ StackName: stackName })
    .promise();

  if (!response.Stacks) {
    throw new Error(`No stack found with name ${stackName}`);
  }

  const retrievedStack = response.Stacks.find((stack) => {
    return stack.StackName === stackName;
  });

  if (!retrievedStack) {
    throw new Error(`No stack found with name ${stackName}`);
  }

  return retrievedStack.Outputs;
};
