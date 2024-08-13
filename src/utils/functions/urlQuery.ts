export const urlQuery = (value: URLSearchParams): any => {
  const search = value.toString() || "";

  return `?${search}`;
};
