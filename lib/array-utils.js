export function partition(array, ...predicates) {
  const partitions = predicates.map(() => []);

  for (const item of array) {
    for (const [index, predicate] of predicates.entries()) {
      if (predicate(item)) {
        partitions[index].push(item);
        break;
      }
    }
  }

  return partitions;
}
