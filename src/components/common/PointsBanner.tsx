import HowItWorks from "./HowItWorks";
import React, { useState } from "react";
import Modal from "./Modal";

type Props = {
  variant: string;
  userXp?: number;
  titleMessage?: string;
  subHeadingMessage?: string;
  buttonMessage?: string;
  buttonLink?: string;
  shouldShow: boolean;
};

function PointsBanner({
  variant,
  userXp,
  titleMessage,
  subHeadingMessage,
  buttonLink,
  buttonMessage,
  shouldShow,
}: Props) {
  const [showHowItWorkModal, setShowHowItWorkModal] = useState(false);

  return (
    <div className={`${shouldShow ? "" : "hidden"}`}>
      <div
        className={`relative flex flex-row overflow-hidden items-end justify-between w-full bg-secondary-banner bg-contain bg-no-repeat bg-right border-2 lg:border-t-0 lg:!border-l-0 lg:border-b-0 border-cardborder p-2 sm:p-4 `}
      >
        <img
          src="/img/common/qualify-now-banner.svg"
          className="absolute -top-12 -right-12"
          alt="Qualify Now Banner"
          width={128}
          height={128}
        />
        <div className="flex flex-col h-full justify-between gap-2 ">
          <div className="flex items-center gap-1">
            <div className="rounded-full w-2 h-2 bg-printer-red"></div>
            <p className="text-sm font-bold text-white">
              {titleMessage ? titleMessage : "Earn Rewards on PRINT3R"}
            </p>
          </div>
          <p className="text-10 md:text-xs font-medium text-printer-green ">
            {subHeadingMessage ? subHeadingMessage : "Earn  XP as you trade."}
          </p>
          <div className="flex items-center gap-1 bg-input-grad border-2 border-cardborder rounded-3 px-2 py-2 justify-between">
            <p className="text-xs font-medium text-stone-300 ">Your XP</p>

            <div className="flex items-center gap-1">
              <img
                src="/img/common/brrr-star.png"
                className="w-4 h-4"
                alt="BRRR Star"
                width={128}
                height={128}
              />
              <p className="text-sm font-bold text-white">
                {userXp ? userXp : "..."}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col  justify-between items-end gap-2 ">
          <button
            className="px-3 py-1 border-2 border-emerald-400 max-h-[40px] rounded-3 text-stone-300 text-xs font-bold bg-card-grad hover:bg-cardblack z-[2]"
            onClick={() => {
              if (buttonLink) {
                window.open(buttonLink, "_blank", "noopener noreferrer");
              } else {
                setShowHowItWorkModal(true);
              }
            }}
          >
            {buttonMessage ? buttonMessage : "Learn More"}
          </button>
        </div>
      </div>
      <Modal
        label={
          <p className="text-center w-full text-2xl font-bold">
            {variant !== "earn"
              ? "HOW IT WORKS - Seasonal Airdrops"
              : "HOW IT WORKS - Supply Assets & Earn!"}
          </p>
        }
        className=""
        isVisible={showHowItWorkModal}
        setIsVisible={setShowHowItWorkModal}
      >
        <HowItWorks
          setShowHowItWorkModal={setShowHowItWorkModal}
          variant={variant === "earn" ? undefined : "airdrop"}
        />
      </Modal>
    </div>
  );
}

export default PointsBanner;
