export const formatSeconds = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};
