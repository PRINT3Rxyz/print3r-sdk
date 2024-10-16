import { contractAddresses } from "./contractAddresses";
import { IERC20ABI as abi } from "./abis/IERC20";
import { getPublicClient } from "./clients";
import { formatUnits } from "viem";

export const getUsdcBalance = async (
  chainId: number,
  address: `0x${string}`
) => {
  const publicClient = getPublicClient(chainId);
  const balance = await publicClient.readContract({
    abi,
    address: contractAddresses[chainId].USDC as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
  });
  return formatUnits(balance, 6);
};

// Function to get Ether balance
export const getEtherBalance = async (
  chainId: number,
  address: `0x${string}`
) => {
  const publicClient = getPublicClient(chainId);
  const balance = await publicClient.getBalance({
    address,
  });
  return formatUnits(balance, 18);
};

export const getWrappedEtherBalance = async (
  chainId: number,
  address: `0x${string}`
) => {
  const publicClient = getPublicClient(chainId);
  const balance = await publicClient.readContract({
    abi,
    address: contractAddresses[chainId].WETH as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
  });
  return formatUnits(balance, 18);
};

/**
 * Helper function to format a UNIX timestamp as a full date and time.
 * @param timestamp - The UNIX timestamp in seconds.
 * @returns The formatted date and time string.
 */
export const formatUnixTimestamp = (timestamp: number): string => {
  // Create a Date object from the UNIX timestamp
  const date = new Date(timestamp * 1000);

  // Define options for the date formatting
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  };

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  // Remove the trailing "UTC" to match the desired output
  const formattedDateWithoutUTC = formattedDate.replace(", UTC", " UTC");

  return formattedDateWithoutUTC;
};

export const getPriceDecimals = (price: number): number => {
  if (price >= 1000) {
    return 2;
  }

  if (price >= 1) {
    return 4;
  }

  const priceStr = price.toString();
  const [, decimalPart] = priceStr.split(".");

  if (!decimalPart) {
    return 2;
  }

  let significantDigits = 0;
  let leadingZeros = 0;
  let foundNonZero = false;

  for (const char of decimalPart) {
    if (char === "0" && !foundNonZero) {
      leadingZeros++;
    } else {
      foundNonZero = true;
      significantDigits++;
      if (significantDigits === 4) break;
    }
  }

  // For very small numbers in scientific notation (e.g., 1.86218470239e-9)
  if (priceStr.includes("e-")) {
    const [base, exponent] = priceStr.split("e-");
    const exponentNum = parseInt(exponent, 10);
    return Math.max(2, exponentNum + 4);
  }

  return Math.max(2, leadingZeros + 4);
};

// If USDC 6, else (ETH/WETH) 18
export const getCollateralDecimals = (symbol: string): number => {
  return symbol === "USDC" ? 6 : 18;
};
