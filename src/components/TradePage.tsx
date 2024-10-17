import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import AssetBanner from "./assets/AssetBanner";
import Positions from "./positions/Positions";
import TabNavigation from "./positions/TabNavigation";
import useWindowSize from "../hooks/useWindowSize";
import { AssetProvider } from "./assets/AssetContext";
import { Asset } from "../types/assets";
import { ResolutionString } from "../../public/static/charting_library/charting_library";
import TradeButtons from "./interaction/TradeButtons";
import TypeButtons from "./interaction/TypeButtons";
import SizeInput from "./interaction/SizeInput";
import MarketStats from "./stats/MarketStats";
import Loader from "./TVChartContainer/Loader";
import useWallet from "../hooks/useWallet";
import { ClosedPosition, Order, Position } from "../types/positions";
import { getAllPositions } from "../utils/positions/getAllPositions";
import { ChartLine } from "./TVChartContainer/TradingViewChart";
import { estimateLiquidationPrice } from "../utils/positions/estimateLiquidationPrice";
import { getNameFromChainId } from "../utils/web3/config";
import { formatUnixTimestamp, getPriceDecimals } from "../utils/web3/utils";
import ModalV2 from "./common/ModalV2";
import ModalClose from "./common/ModalClose";
import { getMarketTokenPrices } from "../utils/web3/getMarketTokenPrices";
import { getMarketStats } from "../utils/web3/getMarketStats";
import { getChartSymbol } from "./TVChartContainer/trading-view-symbols";
import useInterval from "../hooks/useInterval";
import { TVDataProvider } from "../utils/tradingview/TVDataProvider";
import { v4 as uuidv4 } from "uuid";
import { debounce } from "lodash";
import TradingViewChart from "./TVChartContainer/TradingViewChart";
import { getPublicClient } from "../utils/web3/clients";
import { contractAddresses } from "../utils/web3/contractAddresses";
import { MarketFactoryABI } from "../utils/web3/abis/MarketFactory";

const TradePage = ({
  customId,
  chainName,
}: {
  customId: string;
  chainName: string;
}) => {
  const [activeTab, setActiveTab] = useState("My Trades");
  const { width } = useWindowSize();
  const windowLtXl = width && width < 1280;

  // Onchain Price for the current asset in context
  const [markPrice, setMarkPrice] = useState(0);

  // Chart Price
  const [chartPrice, setChartPrice] = useState(0);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [isLong, setIsLong] = useState(true);
  const [activeType, setActiveType] = useState("Market");
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [chartLines, setChartLines] = useState<ChartLine[]>([]);
  // Pass into size input
  const [liqPrice, setLiqPrice] = useState(0);
  const [collateral, setCollateral] = useState<string>("");
  const [leverage, setLeverage] = useState(1.1);
  const [priceDecimals, setPriceDecimals] = useState(7);
  const [showPositionLines, setShowPositionLines] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [refreshVolume, setRefreshVolume] = useState(0);
  const [marketTokenPrices, setMarketTokenPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });
  const [marketStats, setMarketStats] = useState<{
    borrowRateLong: number;
    borrowRateShort: number;
    fundingRate: number;
    fundingRateVelocity: number;
    availableLiquidityLong: number;
    availableLiquidityShort: number;
    openInterestLong: number;
    openInterestShort: number;
  }>({
    borrowRateLong: 0,
    borrowRateShort: 0,
    fundingRate: 0,
    fundingRateVelocity: 0,
    availableLiquidityLong: 0,
    availableLiquidityShort: 0,
    openInterestLong: 0,
    openInterestShort: 0,
  });
  const [pendingPositions, setPendingPositions] = useState<Position[]>([]);
  const [decreasingPosition, setDecreasingPosition] = useState<Position | null>(
    null
  );

  const tvDataProviderRef = useRef<TVDataProvider | null>(null);

  const { chainId, account, isLoading } = useWallet();

  const positionsRef = useRef({ openPositions, orders, closedPositions });

  useEffect(() => {
    positionsRef.current = { openPositions, orders, closedPositions };
  }, [openPositions, orders, closedPositions]);

  const openTradeModal = (newIsLong: boolean) => {
    setIsLong(newIsLong);
    setIsTradeModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
  };

  const createPendingPosition = (position: Position) => {
    const pendingPosition: Position = {
      id: uuidv4(),
      isPending: true,
      symbol: position.symbol || "",
      isLong: position.isLong || false,
      size: position.size || 0,
      collateral: position.collateral || 0,
      entryPrice: 0,
      entryTime: formatUnixTimestamp(Date.now() / 1000),
      liqPrice: 0,
      adlEvents: [],
      marketId: `0x0`,
      positionKey: `0x0`,
    };
    // Wait 3s
    setTimeout(() => {}, 3000);
    setPendingPositions((prevPositions) => [pendingPosition, ...prevPositions]);
  };

  const refreshPendingPosition = useCallback(
    async (id: string, success: boolean) => {
      if (!account) return;

      if (success) {
        const fetchPositionsWithRetry = async (
          retryCount = 0
        ): Promise<void> => {
          // Wait for 3 seconds before calling getAllPositions
          await new Promise((resolve) => setTimeout(resolve, 3000));

          try {
            // Fetch all updated positions
            const {
              openPositions: newOpenPositions,
              orders: newOrders,
              closedPositions: newClosedPositions,
            } = await getAllPositions(
              chainId,
              account,
              true, // Force refresh
              marketTokenPrices.ethPrice,
              marketTokenPrices.usdcPrice
            );

            const filteredPendingPositions = pendingPositions.filter(
              (pos) => pos.id !== id
            );

            // Remove the pending position
            setPendingPositions(filteredPendingPositions);

            if (
              newOpenPositions.length === openPositions.length &&
              retryCount < 2
            ) {
              // If there's no change in openPositions, retry after 3 seconds
              return fetchPositionsWithRetry(retryCount + 1);
            }

            // Update all position states
            setOpenPositions(newOpenPositions);
            setOrders(newOrders);
            setClosedPositions(newClosedPositions);
          } catch (error) {
            console.error("Error refreshing positions:", error);
          }
        };

        fetchPositionsWithRetry();
      } else {
        // If not successful, simply remove the pending position
        setPendingPositions((prevPositions) =>
          prevPositions.filter((pos) => pos.id !== id)
        );
      }
    },
    [chainId, account, marketTokenPrices.ethPrice, marketTokenPrices.usdcPrice]
  );

  const fetchMarketTokenPrices = useCallback(async () => {
    const { ethPrice, usdcPrice } = await getMarketTokenPrices();
    setMarketTokenPrices({ ethPrice, usdcPrice });
  }, []);

  const fetchPositionData = useCallback(
    async (shouldRefresh: boolean) => {
      if (
        !chainId ||
        !account ||
        !customId ||
        marketTokenPrices.ethPrice === 0 ||
        marketTokenPrices.usdcPrice === 0
      ) {
        return;
      }

      setIsTableLoading(true);

      try {
        const {
          openPositions: newOpenPositions,
          orders: newOrders,
          closedPositions: newClosedPositions,
        } = await getAllPositions(
          chainId,
          account,
          shouldRefresh,
          marketTokenPrices.ethPrice,
          marketTokenPrices.usdcPrice
        );

        setOpenPositions(newOpenPositions);
        setOrders(newOrders);
        setClosedPositions(newClosedPositions);
      } catch (error) {
        console.error("Error fetching position data:", error);
      } finally {
        setIsTableLoading(false);
      }
    },
    [
      chainId,
      account,
      customId,
      marketTokenPrices.ethPrice,
      marketTokenPrices.usdcPrice,
    ]
  );

  // Fetch position data once when component mounts or when critical dependencies change
  useEffect(() => {
    fetchPositionData(false);
  }, [fetchPositionData]);

  const debouncedRefreshPositionData = useMemo(
    () =>
      debounce(() => {
        fetchPositionData(true);
      }, 1000),
    [fetchPositionData]
  );

  useEffect(() => {
    return () => {
      debouncedRefreshPositionData.cancel();
    };
  }, [debouncedRefreshPositionData]);

  const refreshPositionData = useCallback(() => {
    debouncedRefreshPositionData();
  }, [debouncedRefreshPositionData]);

  const fetchMarketStats = useCallback(async () => {
    if (!asset || !asset.price) return;

    if (!marketTokenPrices.ethPrice || !marketTokenPrices.usdcPrice) return;

    const newMarketStats = await getMarketStats(
      chainId,
      asset.marketId,
      asset.price,
      marketTokenPrices.ethPrice,
      marketTokenPrices.usdcPrice
    );

    setMarketStats(newMarketStats);
  }, [asset, chainId, marketTokenPrices]);

  useEffect(() => {
    fetchMarketTokenPrices();
  }, []);

  /**
   * Get marketId from custom id and use that to fetch asset --> MarketFactory.getMarketForTicker(customId)
   */
  useEffect(() => {
    const fetchAsset = async () => {
      if (!customId) return;

      const publicClient = getPublicClient(chainId);

      const marketFactory = contractAddresses[chainId]
        .MARKET_FACTORY as `0x${string}`;

      const marketId = await publicClient.readContract({
        abi: MarketFactoryABI,
        address: marketFactory,
        functionName: "getMarketForTicker",
        args: [customId],
      });

      let chainName = chainId ? getNameFromChainId(chainId) : "baseSepolia";

      const BACKEND_URL =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

      try {
        const response = await fetch(
          `${BACKEND_URL}/assets/asset?chain=${chainName}&marketId=${marketId}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch assets: ${response.statusText}`);
        }

        const asset: Asset = await response.json();

        setAsset(asset);
      } catch (error) {
        console.error("Error fetching listed assets:", error);
      }
    };

    fetchAsset();
  }, [chainId, customId, isLoading]);

  useEffect(() => {
    if (tvDataProviderRef.current) {
      tvDataProviderRef.current.updateLivePrice(markPrice);
    }
  }, [markPrice]);

  useEffect(() => {
    setMarkPrice(0);
  }, [asset]);

  const updatePriceForAsset = useCallback(async () => {
    if (asset && asset.customId) {
      const PRICE_SERVER_URL =
        import.meta.env.VITE_PRICE_SERVER_URL || "http://localhost:5002";

      try {
        const response = await fetch(
          `${PRICE_SERVER_URL}/prices/get-price?customId=${asset.customId}`
        );

        if (response.ok) {
          const priceResponse = await response.json();
          setMarkPrice(priceResponse.price);
        } else {
          console.error(`Failed to fetch data for ${asset.customId}`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${asset.customId}:`, error);
      }
    }
  }, [asset]);

  useEffect(() => {
    setIsTablet(width !== undefined && width <= 768);
  }, [width]);

  // Update the price every 5 seconds
  useInterval(updatePriceForAsset, 5000);

  useEffect(() => {
    const fetchPriceDecimals = async () => {
      if (!markPrice) return;
      const priceDecimals = getPriceDecimals(markPrice);
      setPriceDecimals(priceDecimals);
    };

    fetchPriceDecimals();
  }, [markPrice]);

  useEffect(() => {
    fetchMarketStats();
  }, [asset, chainId, fetchMarketStats]);

  useEffect(() => {
    const updateLiqPrice = () => {
      setLiqPrice(
        estimateLiquidationPrice({
          entryPrice: markPrice || 0,
          collateralUsd: parseFloat(collateral),
          sizeUsd: parseFloat(collateral) * leverage,
          isLong: isLong,
        })
      );
    };
    updateLiqPrice();
  }, [collateral, leverage, markPrice, isLong]);

  useEffect(() => {
    const updateLiqPrice = () => {
      setLiqPrice(
        estimateLiquidationPrice({
          entryPrice: markPrice || 0,
          collateralUsd: parseFloat(collateral),
          sizeUsd: parseFloat(collateral) * leverage,
          isLong: isLong,
        })
      );
    };
    updateLiqPrice();
  }, [collateral, leverage, markPrice, isLong]);

  useEffect(() => {
    const getChartLines = (positions: Position[], orders: Order[]) => {
      if (!asset) return;

      const lines: ChartLine[] = [];

      positions.forEach((position) => {
        const entryLine: ChartLine = {
          price: position.entryPrice,
          title: `Opened ${position.symbol} - ${
            position.isLong ? "Long" : "Short"
          }`,
          type: "entry",
          symbol: position.symbol,
        };
        const liquidationLine: ChartLine = {
          price: position.liqPrice,
          title: `Liquidation ${position.symbol} - ${
            position.isLong ? "Long" : "Short"
          }`,
          type: "liquidation",
          symbol: position.symbol,
        };
        lines.push(entryLine);
        lines.push(liquidationLine);
      });

      orders.forEach((order) => {
        const orderLine: ChartLine = {
          price: order.triggerPrice,
          // Covers Buy / Sell Limits, Stop Losses and Take Profits
          title: `${order.symbol} ${order.orderType} - ${
            order.isLong ? "Long" : "Short"
          }`,
          type: order.orderType,
          symbol: order.symbol,
        };
        lines.push(orderLine);
      });

      const filteredLines = lines.filter((line) => {
        return line.symbol === asset.customId;
      });

      setChartLines(filteredLines);
    };

    getChartLines(openPositions, orders);
  }, [openPositions, orders, asset]);

  const isMarkPriceReady = markPrice !== 0;

  return (
    <AssetProvider asset={asset} setAsset={setAsset}>
      <div
        className={`flex flex-col gap-4 relative lg:gap-0 lg:mt-0 lg:px-0 lg:flex-row w-full md:max-h-[90vh] bottom-0 left-0 right-0 bg-[#07080A] max-w-[2000px]  mx-auto 3xl:border-b border-cardborder 3xl:border-x`}
      >
        <div
          className={` flex flex-col  lg:gap-0  lg:w-[70%] lg:sticky lg:max-h-[90vh] lg:left-0 lg:top-0 lg:h-fit lg:overflow-y-auto no-scrollbar lg:pb-20  lg:border-r-2 border-r-cardborder  `}
        >
          <AssetBanner markPrice={markPrice} refreshVolume={refreshVolume} />
          <div className="h-[550px] ">
            {asset && isMarkPriceReady ? (
              <TradingViewChart
                asset={asset}
                markPrice={markPrice}
                assetForPrice={asset.symbol}
                setChartPrice={setChartPrice}
                symbol={getChartSymbol(asset)}
                priceDecimals={asset.priceDecimals ?? 2}
                period={"1" as ResolutionString}
                onSelectToken={setAsset}
                savedShouldShowPositionLines={showPositionLines}
                chartLines={chartLines}
              />
            ) : (
              <Loader />
            )}
          </div>

          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            chartPositions={showPositionLines}
            setChartPositions={setShowPositionLines}
          />

          <Positions
            activeTab={activeTab}
            openPositions={openPositions}
            orders={orders}
            closedPositions={closedPositions}
            triggerGetTradeData={refreshPositionData}
            isTableLoading={isTableLoading}
            currentMarketOnly={true}
            pendingPositions={pendingPositions}
            updateMarketStats={fetchMarketStats}
            decreasingPosition={decreasingPosition}
            setDecreasingPosition={setDecreasingPosition}
          />
        </div>
        <div
          className={`flex flex-col justify-start lg:w-[30%] lg:sticky lg:max-h-[90vh] lg:right-0 lg:top-0 lg:overflow-y-auto no-scrollbar pb-20 lg:pb-20`}
        >
          {!isTablet && (
            <div className="flex flex-col w-full h-auto">
              <div className="flex flex-col w-full gap-4 bg-card-grad border-cardborder border-2 lg:!border-l-0 p-4">
                <TradeButtons isLong={isLong} setIsLong={setIsLong} />
                <TypeButtons
                  activeType={activeType}
                  setActiveType={setActiveType}
                  isEntry={true}
                />
                <SizeInput
                  isLong={isLong}
                  activeType={activeType}
                  leverage={leverage}
                  setLeverage={setLeverage}
                  collateral={collateral}
                  setCollateral={setCollateral}
                  markPrice={markPrice}
                  liqPrice={liqPrice || 0}
                  priceDecimals={priceDecimals}
                  triggerRefetchPositions={refreshPositionData}
                  marketStats={marketStats}
                  triggerRefreshVolume={() =>
                    setRefreshVolume((prev) => prev + 1)
                  }
                  updateMarketStats={fetchMarketStats}
                  createPendingPosition={createPendingPosition}
                  refreshPendingPosition={refreshPendingPosition}
                />
              </div>
              <MarketStats
                isLong={isLong}
                entryPrice={markPrice ?? 0.0}
                liqPrice={liqPrice || 0}
                priceDecimals={priceDecimals}
                marketStats={marketStats}
              />
            </div>
          )}
        </div>
      </div>
      {isTablet && (
        <div className="fixed bottom-[0rem] z-50 left-0 right-0 bg-card-grad border-y-2 border-cardborder p-4">
          <TradeButtons
            isLong={isLong}
            setIsLong={setIsLong}
            openTradeModal={openTradeModal}
          />
        </div>
      )}
      <ModalV2 isOpen={isTradeModalOpen} setIsModalOpen={setIsTradeModalOpen}>
        <div className="flex flex-col h-screen w-screen fixed inset-0 z-[150] bg-card-grad overflow-y-auto overscroll-y-auto custom-scrollbar">
          <div className="flex-grow pb-24 md:pb-0">
            <div className="flex flex-col w-full gap-4 p-4 min-h-screen">
              <div className="flex flex-row justify-between w-full items-center">
                <p className="text-xl font-bold text-white">Trade</p>
                <ModalClose onClose={closeTradeModal} />
              </div>
              <TypeButtons
                activeType={activeType}
                setActiveType={setActiveType}
                isEntry={true}
              />
              <SizeInput
                isLong={isLong}
                activeType={activeType}
                leverage={leverage}
                setLeverage={setLeverage}
                collateral={collateral}
                setCollateral={setCollateral}
                markPrice={markPrice}
                liqPrice={liqPrice || 0}
                priceDecimals={priceDecimals}
                triggerRefetchPositions={() => {
                  closeTradeModal(); //Close the modal after execution
                  refreshPositionData();
                }}
                marketStats={marketStats}
                triggerRefreshVolume={() =>
                  setRefreshVolume((prev) => prev + 1)
                }
                updateMarketStats={fetchMarketStats}
                createPendingPosition={createPendingPosition}
                refreshPendingPosition={refreshPendingPosition}
              />
            </div>
          </div>
        </div>
      </ModalV2>
    </AssetProvider>
  );
};

export default TradePage;
