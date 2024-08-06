export const CompareObjects = (
  obj1: { [key: string]: any },
  obj2: { [key: string]: any },
) => {
  const keys = Object.keys(obj1);

  for (let key of keys) {
    if (obj1[key] === obj2[key]) {
      return false;
    }
  }
  return true;
};
