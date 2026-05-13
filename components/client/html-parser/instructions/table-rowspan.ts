let rowspanTdCounter = 0;

export const resetRowspanTdCounter = () => {
  rowspanTdCounter = 0;
};

export const nextRowspanTdIsEven = () => {
  const isEvenRowspanCell = rowspanTdCounter % 2 === 0;
  rowspanTdCounter += 1;
  return isEvenRowspanCell;
};
