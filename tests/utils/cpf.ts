export function generateCPF(): string {
  const random = (n: number) => Math.floor(Math.random() * n);
  const mod = (dividend: number, divisor: number) => Math.round(dividend - (Math.floor(dividend / divisor) * divisor));

  const n = Array.from({ length: 9 }, () => random(9));

  let d1 = n.reduce((acc, val, i) => acc + val * (10 - i), 0);
  d1 = 11 - mod(d1, 11);
  if (d1 >= 10) d1 = 0;

  let d2 = n.reduce((acc, val, i) => acc + val * (11 - i), 0) + d1 * 2;
  d2 = 11 - mod(d2, 11);
  if (d2 >= 10) d2 = 0;

  return n.join("") + d1.toString() + d2.toString();
}
