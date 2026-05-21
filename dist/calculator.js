export function calculateLimitUp(input) {
    validateInput(input);
    const growth = 1 + input.limitUpPercent / 100;
    const maxSteps = input.maxSteps ?? 5000;
    let current = input.initialPrincipal;
    const steps = [];
    if (current >= input.targetAmount) {
        return {
            reached: true,
            reachedAtStep: 0,
            steps
        };
    }
    for (let step = 1; step <= maxSteps; step += 1) {
        current *= growth;
        steps.push({
            step,
            amount: roundTo(current, 3)
        });
        if (current >= input.targetAmount) {
            return {
                reached: true,
                reachedAtStep: step,
                steps
            };
        }
    }
    return {
        reached: false,
        reachedAtStep: null,
        steps
    };
}
function validateInput(input) {
    if (!Number.isFinite(input.initialPrincipal) || input.initialPrincipal <= 0) {
        throw new Error("initialPrincipal 必须是大于 0 的数字");
    }
    if (!Number.isFinite(input.limitUpPercent) || input.limitUpPercent <= 0) {
        throw new Error("limitUpPercent 必须是大于 0 的数字");
    }
    if (!Number.isFinite(input.targetAmount) || input.targetAmount <= 0) {
        throw new Error("targetAmount 必须是大于 0 的数字");
    }
    if (input.maxSteps !== undefined) {
        if (!Number.isInteger(input.maxSteps) || input.maxSteps <= 0) {
            throw new Error("maxSteps 必须是大于 0 的整数");
        }
    }
}
function roundTo(value, decimals) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}
