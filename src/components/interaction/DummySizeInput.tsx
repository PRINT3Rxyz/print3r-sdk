import React, { useState } from "react";
import ToggleSwitch from "../common/ToggleSwitch";
import LeverageButtons from "./leverage/LeverageButtons";
import LeverageSlider from "./leverage/LeverageSlider";
import { useAsset } from "../assets/AssetContext";
import CustomSelect from "../common/CustomSelect";
import {
  getImageForToken,
  getImageUrlfromTokenSymbol,
} from "../../utils/common/getTokenImage";
import InputField from "../common/InputField";

const collateralOptions = ["ETH", "USDC", "WETH"];

interface SizeInputProps {
  isLong: boolean;
  activeType: string;
  leverage: number;
  setLeverage: (value: number) => void;
  collateral: string;
  setCollateral: (value: string) => void;
  markPrice: number;
  liqPrice: number;
  priceDecimals: number;
  forDummyBox?: boolean;
  triggerRefetchPositions: () => void;
}

const DummySizeInput: React.FC<SizeInputProps> = ({
  isLong,
  activeType,
  leverage,
  setLeverage,
  collateral,
  setCollateral,
  markPrice,
  liqPrice,
  priceDecimals,
  forDummyBox,
  triggerRefetchPositions,
}) => {
  const { asset } = useAsset();

  const [useSlider, setUseSlider] = useState(false);

  const [collateralType, setCollateralType] = useState("ETH");

  const [limitPrice, setLimitPrice] = useState(0);

  const [balance, setBalance] = useState<string>("0");

  const [usdValue, setUsdValue] = useState(0);

  const [equivalentAsset, setEquivalentAsset] = useState(0);

  const [stopLossEnabled, setStopLossEnabled] = useState(false);

  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);

  const [leveragedValueUsd, setLeveragedValueUsd] = useState(0);

  const handleCollateralChange = (value: string) => {
    setCollateral(value);
  };

  const handleLeverageChange = (value: number) => {
    setLeverage(value);
  };

  const handleCollateralTypeChange = (selectedType: string) => {
    setCollateralType(selectedType);
  };

  const handleMaxClick = () => {
    setCollateral(balance);
  };

  const handleLimitPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimitPrice(parseFloat(event.target.value));
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg ${forDummyBox ? "mt-4" : ""}`}
    >
      <InputField
        readOnly={false}
        value={collateral}
        onChange={handleCollateralChange}
        className="mt-2"
        placeHolder="0.0"
        renderContent={
          <div className="flex flex-row w-full justify-end items-center gap-2">
            <img
              src={getImageUrlfromTokenSymbol(collateralType)}
              alt={collateralType}
              width={24}
              height={24}
            />
            <CustomSelect
              options={collateralOptions}
              selectedOption={collateralType}
              onOptionSelect={handleCollateralTypeChange}
              showImages={true}
              showText={false}
            />
          </div>
        }
        renderBalance={<p className="font-normal text-xs"></p>}
        renderTitle={
          <label className="block text-printer-gray text-xs">
            Pay: ${usdValue.toFixed(2)}
          </label>
        }
        hideMax
        // setMax={handleMaxClick}
      />
      <div
        className={`flex justify-between items-center ${
          activeType === "Market" ? "mb-4" : ""
        } py-5 px-3 bg-input-grad border-cardborder border-2 rounded-lg`}
      >
        <div>
          <label className="block text-printer-gray text-xs mb-2">
            {isLong ? "Long" : "Short"}: ${leveragedValueUsd.toFixed(2)}
          </label>
          <div className="text-white text-lg">{equivalentAsset.toFixed(2)}</div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row text-printer-gray text-xs gap-2 mb-2">
            <span>Leverage:</span>
            <span className="font-bold">{leverage.toFixed(2)}x</span>
          </div>
          <div className="flex flex-row w-full justify-end items-center gap-2">
            {asset ? (
              <>
                <img
                  src={getImageForToken(asset)}
                  alt={asset.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-bold text-lg  text-printer-gray">
                  {asset.symbol}
                </span>
              </>
            ) : (
              <>
                <div className="rounded-full w-6 h-6 animate-pulse bg-loading"></div>
                <div className="h-4 w-4 animate-pulse bg-loading"></div>
              </>
            )}
          </div>
        </div>
      </div>
      {activeType !== "Market" && (
        <div className="flex justify-between items-center mb-4 py-5 px-3 bg-input-grad border-cardborder border-2 rounded-lg">
          <div>
            <label className="block text-gray-400 mb-2">Price</label>
            <input
              type="number"
              step={0.1}
              onChange={handleLimitPriceChange}
              className="bg-transparent outline-none focus:outline-none focus:ring-0 ring-0 w-full min-w-32 font-bold text-lg  text-printer-gray"
              placeholder="0.0"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row text-printer-gray text-xs gap-2 mb-2">
              <span>Mark Price:</span>
              <span className="font-bold">
                ${asset && asset.price ? asset.price.toFixed(2) : 0}
              </span>
            </div>
            <div className="flex flex-row w-full justify-end items-center gap-2">
              {asset ? (
                <>
                  <img
                    src={getImageForToken(asset)}
                    alt={asset.symbol}
                    width={24}
                    height={24}
                  />
                  <span className="font-bold text-lg  text-printer-gray">
                    {asset.symbol}
                  </span>
                </>
              ) : (
                <>
                  <div className="rounded-full w-6 h-6 animate-pulse bg-loading"></div>
                  <div className="h-4 w-4 animate-pulse bg-loading"></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <label className="block text-gray-400 text-[15px] mb-2">
          <span className="text-gray-text">Leverage</span> Up to{" "}
          <span className="font-bold">{asset ? asset.leverage : "..."}x</span>
        </label>
        <ToggleSwitch
          value={useSlider}
          setValue={setUseSlider}
          label="Slider"
        />
      </div>
      <div className="h-10 mb-2">
        {useSlider ? (
          <LeverageSlider
            min={1.1}
            max={asset ? asset.leverage : 1.1}
            step={0.1}
            initialValue={1.1}
            onChange={handleLeverageChange}
            isLongPosition={isLong}
            unit="x"
          />
        ) : (
          <LeverageButtons
            onChange={(event) =>
              handleLeverageChange(Number(event.target.value))
            }
            maxLeverage={asset ? asset.leverage : 1.1}
            isLongPosition={isLong}
          />
        )}
      </div>
    </div>
  );
};

export default DummySizeInput;
