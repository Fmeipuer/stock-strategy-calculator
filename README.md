# 股票交易策略计算器

一个股票交易策略计算小工具，提供浏览器页面和命令行两种使用方式。

浏览器页面包含多个常用计算模块；命令行工具提供涨停复利、预期股价涨跌、买入份数和做T计算。

## 功能概览

### 浏览器页面

页面入口：`index.html`

包含 8 个功能模块：

1. 涨停复利计算器
2. 止盈止损计算器
3. 预期股价涨跌计算器
4. 买入份数计算器
5. 做T计算器
6. 复利复亏计算器
7. 双账户推演计算器
8. 补仓成本价计算器

### 命令行工具

CLI 入口：`src/index.ts`

支持 4 个计算模式：

1. 涨停复利计算
2. 预期股价涨跌计算
3. 买入份数计算
4. 做T计算

## 技术栈

- TypeScript
- Node.js
- 原生 HTML / CSS / JavaScript
- ES Module

## 项目结构

```text
.
├── index.html                # 浏览器页面入口，包含全部页面计算模块
├── package.json              # 项目脚本与依赖配置
├── package-lock.json         # 依赖锁定文件
├── tsconfig.json             # TypeScript 编译配置
├── src/
│   ├── buy.ts                # 买入份数核心计算逻辑
│   ├── calculator.ts         # 涨停复利核心计算逻辑
│   ├── day-trade.ts          # 做T核心计算逻辑
│   ├── expected-price.ts     # 预期股价涨跌核心计算逻辑
│   ├── index.ts              # CLI 命令行入口
│   └── investment.ts         # 定投收益计算核心逻辑
└── dist/                     # TypeScript 编译输出目录
```

## 页面使用

直接用浏览器打开根目录下的 `index.html` 即可使用。

页面顶部通过标签页切换不同计算模块。

### 涨停复利计算器

用于计算初始本金在连续涨停后达到目标金额所需的次数。

输入：

- 初始本金
- 涨停百分比
- 目标金额

输出：

- 达到目标金额所需涨停次数
- 每次涨停后的金额明细

计算公式：

```text
每次涨停后金额 = 上一次金额 × (1 + 涨停百分比 / 100)
```

页面最多推演 5000 次。

### 止盈止损计算器

用于根据初始价格和止盈 / 止损比例计算目标价格。

输入：

- 初始价格
- 止盈率
- 止损率

输出：

- 止盈价
- 止损价

计算公式：

```text
止盈价 = 初始价格 × (1 + 止盈率 / 100)
止损价 = 初始价格 × (1 - 止损率 / 100)
```

### 预期股价涨跌计算器

用于根据当前股价和预期股价，计算预期上涨或下跌的金额与幅度。

输入：

- 当前股价
- 预期股价

输出：

- 预期方向：上涨、下跌或持平
- 涨跌金额
- 涨跌幅度

计算公式：

```text
涨跌金额 = 预期股价 - 当前股价
涨跌幅度 = 涨跌金额 / 当前股价 × 100%
```

### 买入份数计算器

用于根据买入金额和当前股价，按一手 100 份计算可买入份数和剩余金额。

输入：

- 买入金额
- 当前股价

输出：

- 可买入份数（整手，100 的整数倍）
- 买完后剩余金额

计算公式：

```text
可买入份数 = floor(买入金额 / 当前股价 / 100) × 100
买完后剩余金额 = 买入金额 - 可买入份数 × 当前股价
```

### 做T计算器

用于根据原持仓、做T买入和做T卖出信息，计算本次做T收益、最新成本、最新持有数量和成本降低金额。

页面输入分三行：

```text
持仓成本        原本持仓数量
做T买入成本    买入数量      买入交易手续费
做T卖出的成本  卖出的数量    卖出交易手续费
```

输出：

- 本次做T赚到的金额
- 最新成本
- 最新持有数量
- 本次做T成本降低

计算公式：

```text
最新持有数量 = 原本数量 + 买入数量 - 卖出数量
最新成本 = (原有成本 × 原有数量 + 做T买入成本 × 买入数量 - 做T卖出成本 × 卖出数量 + 买入交易手续费 + 卖出交易手续费) / 最新持有数量
本次做T赚到的金额 = 原来的持仓成本 × 原本持仓数量 - 最新成本 × 最新数量
本次做T成本降低 = 原持仓成本 - 最新成本
```

### 复利复亏计算器

用于计算固定利率在多次连续变化后的复利和复亏结果。

输入：

- 初始金额
- 利率
- 次数

输出：

- 复利后金额
- 复亏后金额

计算公式：

```text
复利后金额 = 初始金额 × (1 + 利率 / 100) ^ 次数
复亏后金额 = 初始金额 × (1 - 利率 / 100) ^ 次数
```

### 双账户推演计算器

用于推演两个账户在多轮相反方向变化后的金额。

输入：

- A 账户初始金额
- B 账户初始金额
- 每轮百分比，支持逗号、中文逗号、顿号或空格分隔，例如：`10,6,8`

计算规则：

```text
A 账户金额 = 上轮金额 × (1 + 当前轮百分比 / 100)
B 账户金额 = 上轮金额 × (1 - 当前轮百分比 / 100)
```

输出：

- 每轮 A / B 账户金额明细
- 最终 A / B 账户金额

### 补仓成本价计算器

用于根据建仓和补仓的成交价格、买入股数、手续费计算补仓需要的金额和补仓后的平均成本价。

输入：

- 建仓成本价格
- 建仓买入股数
- 建仓手续费
- 补仓成本价格
- 补仓买入股数
- 补仓手续费

输出：

- 补仓需要的金额
- 最新成本价
- 总持股数

计算公式：

```text
补仓需要的金额 = 补仓成本价格 × 补仓买入股数 + 补仓手续费
最新成本价 = (建仓成本价格 × 建仓买入股数 + 建仓手续费 + 补仓需要的金额) / 总持股数
总持股数 = 建仓买入股数 + 补仓买入股数
```

## 命令行使用

### 安装依赖

```bash
npm install
```

### 编译项目

```bash
npm run build
```

### 涨停复利计算

默认模式为涨停复利计算。

```bash
npm start -- <初始本金> <涨停百分比> <目标金额> [最大次数]
```

也可以显式指定 `limit-up` 模式：

```bash
npm start -- limit-up <初始本金> <涨停百分比> <目标金额> [最大次数]
```

示例：

```bash
npm start -- 100 10 10000
npm start -- limit-up 100 10 10000 100
```

### 预期股价涨跌计算

```bash
npm start -- expected-price <当前股价> <预期股价>
```

示例：

```bash
npm start -- expected-price 10 12.5
```

输出示例：

```text
当前股价: 10.000
预期股价: 12.500
预期上涨: 2.500
预期上涨幅度: 25.000%
```

### 买入份数计算

```bash
npm start -- buy <买入金额> <当前股价>
```

示例：

```bash
npm start -- buy 2000 13.5
```

输出示例：

```text
买入金额: 2000.000
当前股价: 13.500
可买入份数: 100
买完后剩余金额: 650.000
```

### 做T计算

```bash
npm start -- day-trade <原本持仓数量> <持仓成本> <做T买入成本> <买入数量> <买入交易手续费> <做T卖出成本> <卖出数量> <卖出交易手续费>
```

示例：

```bash
npm start -- day-trade 1000 10 9 100 1 10 100 1
```

输出示例：

```text
本次做T赚到的金额: 102.000
最新成本: 9.898
最新持有数量: 1000
本次做T成本降低: 0.102
```

## 核心模块

### `src/calculator.ts`

提供涨停复利计算能力。

导出类型：

- `LimitUpInput`
- `LimitUpStep`
- `LimitUpResult`

导出函数：

- `calculateLimitUp(input: LimitUpInput): LimitUpResult`

### `src/expected-price.ts`

提供预期股价涨跌计算能力。

导出类型：

- `ExpectedPriceInput`
- `ExpectedPriceResult`

导出函数：

- `calculateExpectedPrice(input: ExpectedPriceInput): ExpectedPriceResult`

输出字段：

- `currentPrice`：当前股价
- `expectedPrice`：预期股价
- `changeAmount`：涨跌金额
- `changePercent`：涨跌幅度
- `direction`：`up`、`down` 或 `flat`

### `src/buy.ts`

提供买入份数计算能力。

导出类型：

- `BuyInput`
- `BuyResult`

导出函数：

- `calculateBuy(input: BuyInput): BuyResult`

输出字段：

- `buyAmount`：买入金额
- `currentPrice`：当前股价
- `shares`：可买入份数，按 100 份一手向下取整
- `remainingAmount`：买完后剩余金额

### `src/day-trade.ts`

提供做T计算能力。

导出类型：

- `DayTradeInput`
- `DayTradeResult`

导出函数：

- `calculateDayTrade(input: DayTradeInput): DayTradeResult`

输入字段：

- `originalShares`：原本持仓数量
- `originalCost`：持仓成本
- `buyPrice`：做T买入成本
- `buyShares`：买入数量
- `buyFee`：买入交易手续费
- `sellPrice`：做T卖出的成本
- `sellShares`：卖出的数量
- `sellFee`：卖出交易手续费

输出字段：

- `profit`：本次做T赚到的金额
- `latestCost`：最新成本
- `latestShares`：最新持有数量
- `costReduction`：本次做T成本降低

### `src/index.ts`

CLI 入口文件，负责：

- 解析命令行模式和参数
- 调用对应核心计算模块
- 格式化并输出计算结果
- 捕获并输出错误信息

支持模式：

- `limit-up`
- `expected-price`
- `buy`
- `day-trade`

### `src/investment.ts`

提供定投收益计算能力。

导出类型：

- `DcaInput`
- `DcaPoint`
- `DcaResult`

导出函数：

- `calculateDca(input: DcaInput): DcaResult`

计算公式：

```text
每月投入后金额 = (上月金额 + 每月投入金额) × (1 + 年化收益率 / 12)
```

输出内容：

- 总投入金额
- 最终金额
- 收益
- 每个月的投入和账户金额明细

## NPM 脚本

| 脚本 | 作用 |
| --- | --- |
| `npm run clean` | 删除 `dist` 编译输出目录 |
| `npm run build` | 使用 `tsc` 编译 TypeScript |
| `npm start` | 运行编译后的 CLI 程序 |

## TypeScript 配置

当前 TypeScript 编译配置：

- 编译目标：`ES2022`
- 模块系统：`NodeNext`
- 模块解析：`NodeNext`
- 开启严格模式：`strict: true`
- 源码目录：`src`
- 输出目录：`dist`

## 常用命令

```bash
npm install
npm run build
npm start -- expected-price 10 12.5
npm start -- buy 2000 13.5
npm start -- day-trade 1000 10 9 100 1 10 100 1
npm start -- 100 10 10000
npm run clean
```

## 使用建议

- 页面计算：直接打开 `index.html`
- 命令行计算：先执行 `npm install` 和 `npm run build`
- 修改 `src` 下的 TypeScript 源码后，需要重新执行 `npm run build`
- 修改 `index.html` 页面逻辑后，刷新浏览器即可看到最新页面
