![Banner][icon-banner]

[![MIT Licensed][icon-license]][link-license]
[![NPM Version][icon-npm]][link-npm]
[![Build Status][icon-ci]][link-ci]
[![Greenkeeper Status][icon-greenkeeper]][link-greenkeeper]

[![Code Issues][icon-issues]][link-issues]
[![Codebase Maintainability][icon-maintainability]][link-maintainability]
[![Test Coverage][icon-coverage]][link-coverage]
[![Jest][icon-jest]][link-jest]

[![Serverless][icon-serverless]][link-serverless]
[![Commitizen][icon-commitizen]][link-commitizen]
[![Semantic Release][icon-semantic-release]][link-semantic-release]
[![Prettier][icon-prettier]][link-prettier]

This project exports the Serverless Framework's own testing utilities so you
can use them to test your own projects.

## Installation

```bash
yarn add -D @endemolshinegroup/serverless-test-utils
```

## Usage

### Example

```typescript
import fs from 'fs';
import path from 'path';

import {
  createTestService,
  deployService,
  removeService,
} from '@endemolshinegroup/serverless-test-utils';

describe('MyServerlessProject', () => {
  let serviceName;

  beforeAll(() => {
    serviceName = createTestService('aws-nodejs', process.cwd());
    deployService();
  });

  it('should have create cloudformation files and functions zip', () => {
    const deployedFiles = fs.readdirSync(path.join(process.cwd(), '.serverless'));
    expect(deployedFiles[0]).toEqual('cloudformation-template-create-stack.json');
    expect(deployedFiles[1]).toEqual('cloudformation-template-update-stack.json');
    expect(deployedFiles[2]).toEqual('serverless-state.json');
    expect(deployedFiles[3]).toMatch(/test-[0-9]{1,}-[0-9]{1,}.zip/);
  });

  afterAll(() => {
    removeService();
  });
});
```

[icon-banner]: docs/assets/banner.png

[icon-license]: https://img.shields.io/github/license/EndemolShineGroup/serverless-test-utils.svg?longCache=true&style=flat-square
[link-license]: LICENSE
[icon-npm]: https://img.shields.io/npm/v/@endemolshinegroup/serverless-test-utils.svg?longCache=true&style=flat-square
[link-npm]: https://www.npmjs.com/package/@endemolshinegroup/serverless-test-utils
[icon-ci]: https://img.shields.io/travis/com/EndemolShineGroup/serverless-test-utils.svg?longCache=true&style=flat-square
[link-ci]: https://travis-ci.com/EndemolShineGroup/serverless-test-utils
[icon-greenkeeper]: https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?longCache=true&style=flat-square
[link-greenkeeper]: https://greenkeeper.io/

[icon-issues]: https://img.shields.io/codeclimate/issues/EndemolShineGroup/serverless-test-utils.svg?longCache=true&style=flat-square
[link-issues]: https://codeclimate.com/github/EndemolShineGroup/serverless-test-utils/issues
[icon-maintainability]: https://img.shields.io/codeclimate/maintainability/EndemolShineGroup/serverless-test-utils.svg?longCache=true&style=flat-square
[link-maintainability]: https://codeclimate.com/github/EndemolShineGroup/serverless-test-utils
[icon-coverage]: https://img.shields.io/codecov/c/github/EndemolShineGroup/serverless-test-utils/develop.svg?longCache=true&style=flat-square
[link-coverage]: https://codecov.io/gh/EndemolShineGroup/serverless-test-utils

[icon-jest]: https://img.shields.io/badge/tested_with-jest-99424f.svg?longCache=true&style=flat-square
[link-jest]: https://jestjs.io/

[icon-serverless]: https://img.shields.io/badge/serverless-%E2%9A%A1%EF%B8%8F-555.svg?longCache=true&style=flat-square
[link-serverless]: http://www.serverless.com

[icon-commitizen]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?longCache=true&style=flat-square
[link-commitizen]: http://commitizen.github.io/cz-cli/
[icon-semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?longCache=true&style=flat-square
[link-semantic-release]: https://semantic-release.gitbooks.io/semantic-release/
[icon-prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?longCache=true&style=flat-square
[link-prettier]: https://prettier.io/

