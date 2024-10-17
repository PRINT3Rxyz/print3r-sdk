import React from "react";
import Checkbox from "../common/Checkbox";
import { FaRegQuestionCircle } from "react-icons/fa";
import InfoTooltip from "../common/InfoTooltip";

const ChartOptions = ({
  shouldShow,
  chartPositions,
  setChartPositions,
}: {
  shouldShow: boolean;
  chartPositions: boolean;
  setChartPositions: (chartPositions: boolean) => void;
}) => {
  return (
    <div
      className={`${
        shouldShow
          ? "grid grid-cols-2 items-center gap-x-4 gap-y-4 xl:px-4"
          : "hidden"
      }`}
    >
      <label className="flex items-center gap-2 font-semibold text-sm order-3 md:order-2 text-gray-text">
        <Checkbox isChecked={chartPositions} setIsChecked={setChartPositions} />
        <span className="text-nowrap">Chart positions</span>
      </label>
      <div className="hidden sm:flex justify-end items-center gap-2 text-gray-text font-semibold text-sm order-2 md:order-3 text-right lg:text-left  ">
        <span className="text-nowrap">Charts by TradingView</span>
        <InfoTooltip
          text="Charts by TradingView"
          content={<FaRegQuestionCircle className="w-4 h-4 text-white" />}
        />
      </div>
    </div>
  );
};

export default ChartOptions;
