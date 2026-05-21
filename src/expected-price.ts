export type ExpectedPriceInput = {
  currentPrice: number;
  expectedPrice: number;
};

export type ExpectedPriceResult = {
  currentPrice: number;
  expectedPrice: number;
  changeAmount: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
};

export function calculateExpectedPrice(input: ExpectedPriceInput): ExpectedPriceResult {
  validateExpectedPriceInput(input);

  const changeAmount = input.expectedPrice - input.currentPrice;
  const changePercent = changeAmount / input.currentPrice * 100;

  return {
    currentPrice: roundTo(input.currentPrice, 3),
    expectedPrice: roundTo(input.expectedPrice, 3),
    changeAmount: roundTo(changeAmount, 3),
    changePercent: roundTo(changePercent, 3),
    direction: getDirection(changeAmount)
  };
}

function validateExpectedPriceInput(input: ExpectedPriceInput): void {
  if (!Number.isFinite(input.currentPrice) || input.currentPrice <= 0) {
    throw new Error("currentPrice 必须是大于 0 的数字");
  }
  if (!Number.isFinite(input.expectedPrice) || input.expectedPrice <= 0) {
    throw new Error("expectedPrice 必须是大于 0 的数字");
  }
}

function getDirection(changeAmount: number): "up" | "down" | "flat" {
  if (changeAmount > 0) {
    return "up";
  }
  if (changeAmount < 0) {
    return "down";
  }
  return "flat";
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
