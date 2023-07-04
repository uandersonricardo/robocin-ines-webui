export const formatSeconds = (seconds: number) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

export const convertTimestampToDate = (timestamp: Timestamp | string) => {
  if (typeof timestamp === "string") {
    return new Date(Number(timestamp.slice(0, -3)));
  }

  return new Date(Number(timestamp.seconds) * 1000 + timestamp.nanos / 1000000);
};
