import React from "react";

type Props = {
  setShowHowItWorkModal: React.Dispatch<React.SetStateAction<boolean>>;
  variant?: string;
};

const how_it_works_data = [
  {
    img: "/img/common/generate-revenue.png",
    data: "You can earn a portion of all trading fees generated on PRINT3R by supplying BTC, ETH or USDC to our BRRR-LP contract on PRINT3R.",
  },
  {
    img: "/img/common/brrr-tokens.png",
    data: "When you supply assets you get BRRR-LP. This is our Liquidity Provision token and is what enables traders to start trading on PRINT3R.",
  },
  {
    img: "/img/common/long-and-short.png",
    data: "BRRR-LP is automatically staked, this means as soon as it is in your wallet you are eligible to earn 70% of all Fees whenever a user trades on PRINT3R.",
  },
  {
    img: "/img/common/earn-rewards.png",
    data: "Any Fee rewards generated from trading are distributed on a weekly basis and can be claimed with a single click! But that's not all....",
  },
  {
    img: "/img/common/brrr-lockers.png",
    data: "You can also earn XP with BRRR-LP, this can be boosted up to 1.75X by time-locking your liquidity in our BRRR-LP Lockers!",
  },
  {
    img: "/img/common/print-tokens.png",
    data: "Providing Liquidity to PRINT3R is a great way to earn 70% of all revenue from our platform AND seasonal Airdrop XP. What's not to love!",
  },
];

const how_it_works_data_airdrop = [
  {
    img: "/img/common/token-distribution.png",
    data: "Get a chance to earn a share of the 50% of the total supply of PRINT tokens, simply by using the PRINT3R app and racking up XP.",
  },
  {
    img: "/img/common/long-and-short.png",
    data: "Earn XP each time you trade (up to 50X leverage), swap assets, share your referrals or by supplying liquidity to the BRRR-LP vaults.",
  },
  {
    img: "/img/common/brrr-lockers.png",
    data: "Boost your XP earnings further by providing liquidity in BRRR-LP vaults, with an option to lock and earn up to a 1.75x XP boost for up to 180 days.",
  },
  {
    img: "/img/common/complete-challenges.png",
    data: "Challenges earn more! Tackle your daily, weekly, and seasonal challenges to earn significant XP bundles to progress in your PRINT3R journey.",
  },
  {
    img: "/img/common/claim-loot-crates.png",
    data: "As you progress you’ll also gems. These can be used to unlock lootboxes, giving you more XP, additional gems, and exclusive merch.",
  },
  {
    img: "/img/common/seasonal-airdrops.png",
    data: "Engage with the PRINT3R app for fun and rewards. Trade, provide liquidity, complete challenges, and collect gems to earn your share of PRINT tokens.",
  },
];

function HowItWorks({ setShowHowItWorkModal, variant }: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 justify-center place-items-center justify-items-center md:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-9">
        {variant && variant === "airdrop"
          ? how_it_works_data_airdrop.map((item, i) => (
              <div key={i} className="flex flex-col gap-2 w-[266px]">
                <img src={item.img} height={177} alt="" width={128} />
                <p className="text-sm font-normal text-slate-500">
                  {item.data}
                </p>
              </div>
            ))
          : how_it_works_data.map((item, i) => (
              <div key={i} className="flex flex-col gap-2 w-[266px]">
                <img
                  src={item.img}
                  className=" h-[177px]  "
                  alt=""
                  width={128}
                  height={128}
                />
                <p className="text-sm font-normal text-slate-500">
                  {item.data}
                </p>
              </div>
            ))}
      </div>
      <button
        className="w-full mx-auto md:w-96 text-white text-15 font-bold bg-green-grad hover:bg-green-grad-hover rounded-3 px-3 py-4"
        onClick={() => {
          setShowHowItWorkModal(false);
        }}
      >
        Got it! Lets Go!
      </button>
    </div>
  );
}

export default HowItWorks;
