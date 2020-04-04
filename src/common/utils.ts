const KILOBYTE = 1000;
const MEGABYTE = KILOBYTE * 1000;
const GIGABYTE = MEGABYTE * 1000;

export const formatByteDisplay = (numBytes: number) => {
  let rawCount = numBytes;
  let prefix = "B";

  if (numBytes === 0) {
  } else if (numBytes >= GIGABYTE) {
    rawCount = numBytes / GIGABYTE;
    prefix = "GB";
  } else if (numBytes >= MEGABYTE) {
    rawCount = numBytes / MEGABYTE;
    prefix = "MB";
  } else if (numBytes >= KILOBYTE) {
    rawCount = numBytes / KILOBYTE;
    prefix = "KB";
  }

  return `${Number(rawCount.toFixed(2))} ${prefix}`;
};
