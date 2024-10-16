import { getImageUrlfromTokenSymbol } from "../../utils/common/getTokenImage";
import { formatFloatWithCommas } from "../../utils/common/formatters";

const LiquidityTooltip = ({
  indexTokenSymbol,
  totalAvailableLpTokens,
  userDepositTokens,
  availableLiquidity,
}: {
  indexTokenSymbol: string;
  totalAvailableLpTokens: number;
  userDepositTokens: number;
  availableLiquidity: { eth: number; usdc: number };
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 w-[350px]">
      <div className="flex flex-row gap-2 items-center w-full">
        <img
          src={getImageUrlfromTokenSymbol(indexTokenSymbol)}
          width={24}
          height={24}
          alt="pool asset image"
          className="rounded-full"
        />
        <p className="text-white text-base font-semibold">{indexTokenSymbol}</p>
      </div>
      <div className="flex flex-row w-full gap-4">
        <div className="flex flex-col w-1/2 gap-2 justify-between">
          <div>
            <p className="text-gray-text text-15 font-medium text-nowrap">{`My Total ${indexTokenSymbol} LP`}</p>
            <p className="text-white text-base font-semibold">
              {formatFloatWithCommas(totalAvailableLpTokens)}
            </p>
          </div>
          <div>
            <p className="text-gray-text text-15 font-medium">Available:</p>
            <p className="text-white text-base font-semibold">
              {formatFloatWithCommas(userDepositTokens)}
            </p>
          </div>
          <div>
            <p className="text-gray-text text-15 font-medium">Locked:</p>
            <div className="flex flex-row gap-2 items-center">
              <img
                src={"/img/lock-img.png"}
                width={16}
                height={16}
                alt="lock image"
              />
              <p className="text-white text-base font-semibold">
                {formatFloatWithCommas(
                  totalAvailableLpTokens - userDepositTokens
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/2 gap-2">
          <p className="text-gray-text text-15 font-medium">Asset</p>
          <div className="flex flex-row gap-3">
            <img
              src={getImageUrlfromTokenSymbol("ETH")}
              width={24}
              height={24}
              alt="Ethereum Logo"
              className="rounded-full"
            />
            <p className="text-white text-base font-semibold">
              {availableLiquidity.eth.toFixed(4)}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <img
              src={getImageUrlfromTokenSymbol("USDC")}
              width={24}
              height={24}
              alt="USDC Logo"
              className="rounded-full"
            />
            <p className="text-white text-base font-semibold">
              {availableLiquidity.usdc.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityTooltip;
