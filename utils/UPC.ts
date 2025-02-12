export function generateUPC(): string {
  const upcArray: number[] = Array.from({ length: 11 }, () =>
    Math.floor(Math.random() * 10)
  );

  const oddSum = upcArray
    .filter((_, i) => i % 2 === 0)
    .reduce((sum, num) => sum + num, 0);
  const evenSum = upcArray
    .filter((_, i) => i % 2 !== 0)
    .reduce((sum, num) => sum + num, 0);

  const total = oddSum * 3 + evenSum;
  const checkDigit = (10 - (total % 10)) % 10;

  upcArray.push(checkDigit);

  return upcArray.join("");
}
