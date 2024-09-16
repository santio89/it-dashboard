export const objectEquality = (obj1, obj2) => {
  // 1. Get the list of keys from both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 2. Check if the number of keys in both objects is the same
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 3. Iterate through the keys and compare the corresponding values
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};