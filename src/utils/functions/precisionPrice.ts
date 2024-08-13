export const precisionPrice = (value: string) => {
  if (Number(value) > 0) {
    return Number(value).toFixed(2);
  } else {
    return Number(value).toFixed(4);
  }
};
