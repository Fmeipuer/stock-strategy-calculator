import { calculateLimitUp } from "./calculator.js";
import { calculateExpectedPrice } from "./expected-price.js";
import { calculateBuy } from "./buy.js";

type Mode = "limit-up" | "expected-price" | "buy";

type CliArgs = {
  mode: "limit-up";
  initialPrincipal: number;
  limitUpPercent: number;
  targetAmount: number;
  maxSteps?: number;
} | {
  mode: "expected-price";
  currentPrice: number;
  expectedPrice: number;
} | {
  mode: "buy";
  buyAmount: number;
  currentPrice: number;
};

function main(): void {
  const args = parseCliArgs(process.argv.slice(2));

  if (args.mode === "expected-price") {
    printExpectedPrice(args);
    return;
  }

  if (args.mode === "buy") {
    printBuy(args);
    return;
  }

  printLimitUp(args);
}

function printLimitUp(args: Extract<CliArgs, { mode: "limit-up" }>): void {
  const result = calculateLimitUp(args);

  console.log(`初始本金: ${formatMoney(args.initialPrincipal)}`);
  console.log(`涨停百分比: ${args.limitUpPercent}%`);
  console.log(`目标金额: ${formatMoney(args.targetAmount)}`);
  console.log("");

  if (result.reached) {
    console.log(`达到目标需要的涨停次数: ${result.reachedAtStep}`);
  } else {
    console.log(`在最大次数 ${args.maxSteps ?? 5000} 内未达到目标`);
  }

  if (result.steps.length === 0) {
    console.log("本金已经达到或超过目标金额。");
    return;
  }

  console.log("");
  console.log("每次涨停后的金额:");
  for (const row of result.steps) {
    console.log(`第${row.step}次: ${formatMoney(row.amount)}`);
  }
}

function printExpectedPrice(args: Extract<CliArgs, { mode: "expected-price" }>): void {
  const result = calculateExpectedPrice(args);
  const directionText = formatDirection(result.direction);

  console.log(`当前股价: ${formatMoney(result.currentPrice)}`);
  console.log(`预期股价: ${formatMoney(result.expectedPrice)}`);
  console.log(`预期${directionText}: ${formatMoney(Math.abs(result.changeAmount))}`);
  console.log(`预期${directionText}幅度: ${formatPercent(Math.abs(result.changePercent))}`);
}

function printBuy(args: Extract<CliArgs, { mode: "buy" }>): void {
  const result = calculateBuy(args);

  console.log(`买入金额: ${formatMoney(result.buyAmount)}`);
  console.log(`当前股价: ${formatMoney(result.currentPrice)}`);
  console.log(`可买入份数: ${result.shares}`);
  console.log(`买完后剩余金额: ${formatMoney(result.remainingAmount)}`);
}

function parseCliArgs(argv: string[]): CliArgs {
  const mode = parseMode(argv);

  if (mode === "expected-price") {
    return parseExpectedPriceArgs(argv.slice(1));
  }

  if (mode === "buy") {
    return parseBuyArgs(argv.slice(1));
  }

  return parseLimitUpArgs(mode === "limit-up" ? argv.slice(1) : argv);
}

function parseMode(argv: string[]): Mode | undefined {
  if (argv[0] === "limit-up" || argv[0] === "expected-price" || argv[0] === "buy") {
    return argv[0];
  }
  return undefined;
}

function parseExpectedPriceArgs(argv: string[]): CliArgs {
  if (argv.length !== 2) {
    throw new Error(
      "参数数量不正确。用法: node dist/index.js expected-price <当前股价> <预期股价>"
    );
  }

  const currentPrice = Number(argv[0]);
  const expectedPrice = Number(argv[1]);

  if (Number.isNaN(currentPrice) || Number.isNaN(expectedPrice)) {
    throw new Error("当前股价和预期股价必须是数字。");
  }

  return {
    mode: "expected-price",
    currentPrice,
    expectedPrice
  };
}

function parseBuyArgs(argv: string[]): CliArgs {
  if (argv.length !== 2) {
    throw new Error(
      "参数数量不正确。用法: node dist/index.js buy <买入金额> <当前股价>"
    );
  }

  const buyAmount = Number(argv[0]);
  const currentPrice = Number(argv[1]);

  if (Number.isNaN(buyAmount) || Number.isNaN(currentPrice)) {
    throw new Error("买入金额和当前股价必须是数字。");
  }

  return {
    mode: "buy",
    buyAmount,
    currentPrice
  };
}

function parseLimitUpArgs(argv: string[]): CliArgs {
  if (argv.length < 3 || argv.length > 4) {
    throw new Error(
      "参数数量不正确。用法: node dist/index.js [limit-up] <初始本金> <涨停百分比> <目标金额> [最大次数]"
    );
  }

  const initialPrincipal = Number(argv[0]);
  const limitUpPercent = Number(argv[1]);
  const targetAmount = Number(argv[2]);
  const maxSteps = argv[3] !== undefined ? Number(argv[3]) : undefined;

  if (Number.isNaN(initialPrincipal) || Number.isNaN(limitUpPercent) || Number.isNaN(targetAmount)) {
    throw new Error("前三个参数必须是数字。");
  }

  if (argv[3] !== undefined && Number.isNaN(maxSteps)) {
    throw new Error("第四个参数(最大次数)必须是数字。");
  }

  return {
    mode: "limit-up",
    initialPrincipal,
    limitUpPercent,
    targetAmount,
    maxSteps
  };
}

function formatMoney(value: number): string {
  return value.toFixed(3);
}

function formatPercent(value: number): string {
  return `${value.toFixed(3)}%`;
}

function formatDirection(direction: "up" | "down" | "flat"): string {
  if (direction === "up") {
    return "上涨";
  }
  if (direction === "down") {
    return "下跌";
  }
  return "持平";
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : "未知错误";
  console.error(`错误: ${message}`);
  process.exit(1);
}
