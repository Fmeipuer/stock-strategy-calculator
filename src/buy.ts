export type BuyInput = {
  buyAmount: number;
  currentPrice: number;
};

export type BuyResult = {
  buyAmount: number;
  currentPrice: number;
  shares: number;
  remainingAmount: number;
};

export function calculateBuy(input: BuyInput): BuyResult {
  validateBuyInput(input);

  const shares = Math.floor(input.buyAmount / input.currentPrice / 100) * 100;
  const remainingAmount = input.buyAmount - shares * input.currentPrice;

  return {
    buyAmount: roundTo(input.buyAmount, 3),
    currentPrice: roundTo(input.currentPrice, 3),
    shares,
    remainingAmount: roundTo(remainingAmount, 3)
  };
}

function validateBuyInput(input: BuyInput): void {
  if (!Number.isFinite(input.buyAmount) || input.buyAmount <= 0) {
    throw new Error("buyAmount 必须是大于 0 的数字");
  }
  if (!Number.isFinite(input.currentPrice) || input.currentPrice <= 0) {
    throw new Error("currentPrice 必须是大于 0 的数字");
  }
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
