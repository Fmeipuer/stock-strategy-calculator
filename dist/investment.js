export function calculateDca(input) {
    validateDcaInput(input);
    const months = Math.round(input.years * 12);
    const monthlyRate = input.annualReturnRate / 12;
    const points = [];
    let value = 0;
    let invested = 0;
    for (let month = 1; month <= months; month += 1) {
        invested += input.monthlyContribution;
        value = (value + input.monthlyContribution) * (1 + monthlyRate);
        points.push({
            month,
            invested: roundTo(invested, 3),
            value: roundTo(value, 3)
        });
    }
    const totalInvested = roundTo(invested, 3);
    const finalValue = roundTo(value, 3);
    const profit = roundTo(finalValue - totalInvested, 3);
    return {
        totalInvested,
        finalValue,
        profit,
        points
    };
}
function validateDcaInput(input) {
    if (!Number.isFinite(input.monthlyContribution) || input.monthlyContribution <= 0) {
        throw new Error("monthlyContribution 必须大于 0");
    }
    if (!Number.isFinite(input.years) || input.years <= 0) {
        throw new Error("years 必须大于 0");
    }
    if (!Number.isFinite(input.annualReturnRate) || input.annualReturnRate <= -1) {
        throw new Error("annualReturnRate 必须大于 -100%");
    }
}
function roundTo(value, decimals) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
