import getTmpDirPath from './getTmpDirPath';

describe('#getTmpDirPath()', () => {
  it('should return a valid tmpDir path', () => {
    const tmpDirPath = getTmpDirPath();

    expect(tmpDirPath).toMatch(/.+.{16}/);
  });
});
