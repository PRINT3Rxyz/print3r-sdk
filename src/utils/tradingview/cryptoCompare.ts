export interface ExchangeData {
  AffiliateURL: string;
  CentralizationType: string;
  Country: string;
  DISPLAYTOTALVOLUME24H: { BTC: string };
  DepositMethods: string;
  Description: string;
  Fees: string;
  FullAddress: string;
  Grade: string;
  GradePoints: number;
  GradePointsSplit: { [key: string]: string };
  Id: string;
  InternalName: string;
  ItemType: string[];
  LogoUrl: string;
  Name: string;
  OrderBook: boolean;
  Rating: { [key: string]: number };
  Recommended: boolean;
  SortOrder: string;
  Sponsored: boolean;
  TOTALVOLUME24H: { BTC: number };
  Trades: boolean;
  Url: string;
  WithdrawalMethods: string;
}

type SupportedExchanges = [string, any][];

export interface CryptoCompareResponse {
  Response: string;
  Message: string;
  Data: {
    [key: string]: ExchangeData;
  };
}

const validExchanges = new Set([
  "Binance",
  "bybit",
  "Bitfinex",
  "Coinbase",
  "Kraken",
  "Poloniex",
  "OKEX",
  "Upbit",
  "cryptodotcom",
  "Kucoin",
  "Gateio",
  "Bitstamp",
  "Huobi",
]);

export const makeApiRequest = async (path: string) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
    return response.json();
  } catch (error: any) {
    throw new Error(`CryptoCompare request error: ${error.message}`);
  }
};

export const generateSymbol = async (
  exchange: string,
  fromSymbol: string,
  toSymbol: string
): Promise<{ short: string; full: string }> => {
  const short = `${fromSymbol}/${toSymbol}`;
  const full = `${exchange}:${short}`;
  return { short, full };
};

export const parseFullSymbol = async (fullSymbol: string) => {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }
  return { exchange: match[1], fromSymbol: match[2], toSymbol: match[3] };
};

export const fetchCryptoCompareExchanges =
  async (): Promise<CryptoCompareResponse> => {
    try {
      const data = await makeApiRequest("data/exchanges/general");

      // Assert the type of data
      if (typeof data !== "object" || data === null || !("Data" in data)) {
        throw new Error("Unexpected response format from CryptoCompare API");
      }

      // Filter the data to include only valid exchanges
      const filteredData: { [key: string]: ExchangeData } = {};
      for (const [key, exchange] of Object.entries(data.Data)) {
        if (
          typeof exchange === "object" &&
          exchange !== null &&
          "InternalName" in exchange &&
          typeof exchange.InternalName === "string" &&
          validExchanges.has(exchange.InternalName)
        ) {
          filteredData[key] = exchange as ExchangeData;
        }
      }

      // Return the filtered data
      return {
        Response: data.Response,
        Message: data.Message,
        Data: filteredData,
      };
    } catch (error) {
      console.error("Error fetching CryptoCompare exchanges:", error);
      throw error;
    }
  };

export const fetchPairsData = async (): Promise<any> => {
  try {
    const data = await makeApiRequest("data/v3/all/exchanges");
    return data;
  } catch (error) {
    console.error("[fetchPairsData]: Error fetching pairs data:", error);
    throw error;
  }
};

export const filterSupportedExchanges = (
  exchangeData: { [key: string]: ExchangeData },
  supportedExchanges: SupportedExchanges
): { [key: string]: ExchangeData } => {
  const supportedExchangeNames = new Set(
    supportedExchanges.map(([exchangeName]) => exchangeName.toLowerCase())
  );

  const filteredExchangeData: { [key: string]: ExchangeData } = {};

  for (const [id, exchangeInfo] of Object.entries(exchangeData)) {
    if (supportedExchangeNames.has(exchangeInfo.InternalName.toLowerCase())) {
      filteredExchangeData[id] = exchangeInfo;
    }
  }
  return filteredExchangeData;
};
