export const toMap = (array, keyField) => {
  return array?.reduce((map, value) => {
    map.set(value[keyField], value);
    return map;
  }, new Map)
}