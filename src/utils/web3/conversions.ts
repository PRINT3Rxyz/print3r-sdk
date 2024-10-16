import {
  formatEther,
  formatUnits,
  fromHex,
  hexToString,
  padHex,
  parseEther,
  parseUnits,
  toHex,
} from "viem";

/**
 * Converts a float into a USDC amount (bigint) with 6 decimal places to be interpreted by a smart contract
 * e.g 123.456 => 123456000n
 */
export const convertToUsdc = (amount: number): bigint => {
  return parseUnits(amount.toString(), 6) as bigint;
};

export const convertToWei = (amount: number): bigint => {
  return parseEther(amount.toString()) as bigint;
};

export const convertFromWei = (amount: bigint): number => {
  return parseFloat(formatEther(amount));
};

/**
 * Convert a 18 decimal place bigint to a number with specified decimal places.
 * e.g 1234560000000000000n => 123.456
 */
export const contractDecimals = (value: bigint, decimals: number): number => {
  return parseFloat(formatUnits(value, decimals));
};
export const expandDecimals = (value: number, decimals: number): bigint => {
  if (isNaN(value)) {
    return 0n;
  }
  // Convert the number to a string, handling exponential notation
  const stringValue = value.toFixed(30);

  // Use a try-catch block to handle potential errors
  try {
    const result = parseUnits(stringValue, decimals) as bigint;

    return result;
  } catch (error) {
    console.error(`Error expanding decimals: ${error}`);
    // Throw an error instead of returning 0
    throw new Error(`Failed to expand decimals for value: ${value}`);
  }
};

/**
 * Convert Referral Code from String to Bytes32 for the contract.
 * @param referralCode - The referral code string to convert.
 */
export const convertReferralStringToHex = (referralCode: string) => {
  return padHex(toHex(referralCode), { size: 32 });
};

export const convertReferralCodeFromHex = (
  referralCode: `0x${string}`
): string => {
  // Convert hex to string
  const fullString = hexToString(referralCode);

  // Remove null bytes
  return fullString.replace(/\0/g, "");
};

export type TimeOption = "MINUTES" | "HOURS" | "DAYS" | "MONTHS";

export const timeOptions: TimeOption[] = ["MINUTES", "HOURS", "DAYS", "MONTHS"];

export const convertToSeconds = (value: number, unit: TimeOption): number => {
  const bigValue = BigInt(Math.round(value));
  switch (unit) {
    case "MINUTES":
      return Number(bigValue * 60n);
    case "HOURS":
      return Number(bigValue * 60n * 60n);
    case "DAYS":
      return Number(bigValue * 60n * 60n * 24n);
    case "MONTHS":
      return Number(bigValue * 60n * 60n * 24n * 30n);
  }
};
