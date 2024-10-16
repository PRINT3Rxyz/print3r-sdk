/**
 * Helper function to convert a float to a formatted string with commas as thousand separators.
 * @param value - The float value to be converted.
 * @returns The formatted string.
 */
export const formatFloatWithCommas = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Helper function to convert a timestamp to a formatted countdown string.
 * e.g 12345 -> 1d 5h 3m 10s
 */
export const formatDurationWithLocale = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(
    remainingSeconds
  )}s`;
};

// Abbreviates liquidity to a string with a dollar sign
export const formatLiquidity = (liquidity: number): string => {
  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = (Math.log10(Math.abs(liquidity)) / 3) | 0;

  if (tier === 0) return `$${liquidity}`;

  const scale = Math.pow(10, tier * 3);
  const scaled = liquidity / scale;

  return `$${scaled.toFixed(2)}${abbreviations[tier]}`;
};

export const formatSmallNumber = (num: number): string => {
  return num.toFixed(20).replace(/\.?0+$/, "");
};
