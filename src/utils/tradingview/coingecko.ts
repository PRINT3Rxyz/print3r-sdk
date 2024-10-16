export const fetchGeckoTerminalOHLCV = async (
  networks: {
    [network: string]: {
      tokenAddress: `0x${string}`;
      poolAddress: `0x${string}`;
    };
  },
  timeframe: string,
  aggregate: string,
  beforeTimestamp?: number,
  limit: number = 1000,
  currency: string = "usd",
  token: string = "base"
): Promise<any> => {
  const PRICE_SERVER_URL =
    import.meta.env.VITE_PRICE_SERVER_URL || "http://localhost:5002";

  for (const [network, { poolAddress }] of Object.entries(networks)) {
    let mappedNetwork;
    // To handle alternate network names
    if (network === "sui") {
      mappedNetwork = "sui-network";
    } else if (network === "ethereum") {
      mappedNetwork = "eth";
    } else {
      mappedNetwork = network;
    }
    const params = new URLSearchParams({
      network: mappedNetwork,
      poolAddress,
      timeframe,
      aggregate,
      limit: limit.toString(),
      currency,
      token,
    });

    if (beforeTimestamp) {
      params.append("beforeTimestamp", beforeTimestamp.toString());
    }

    const url = `${PRICE_SERVER_URL}/prices/geckoterminal-ohlcv?${params}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn(`Failed to fetch data for network ${network}:`, errorBody);
        continue; // Try the next network
      }

      const data = await response.json();
      return data; // Return the first successful response
    } catch (error) {
      console.warn(`Error fetching OHLCV data for network ${network}:`, {
        error: error instanceof Error ? error.message : String(error),
        url,
        network,
        poolAddress,
        timeframe,
        aggregate,
        beforeTimestamp,
        limit,
        currency,
        token,
      });
      // Continue to the next network
    }
  }

  // If we've exhausted all networks without a successful response
  throw new Error("Failed to fetch OHLCV data from all provided networks");
};
