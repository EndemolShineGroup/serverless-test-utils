import getTmpFilePath from './getTmpFilePath';

describe('getTmpFilePath()', () => {
  it('should return a valid tmpFile path', () => {
    const fileName = 'foo.bar';
    const tmpFilePath = getTmpFilePath(fileName);

    expect(tmpFilePath).toMatch(/.+.{16}.{1}foo\.bar/);
  });
});
