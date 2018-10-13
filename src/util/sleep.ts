export default (time: number) => {
  return new Promise((resolve) => {
    return setTimeout(resolve, time);
  });
};
