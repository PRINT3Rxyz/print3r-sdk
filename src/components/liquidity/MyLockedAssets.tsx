import { formatFloatWithCommas } from "../../utils/common/formatters";
import { contractDecimals } from "../../utils/web3/conversions";
import useWallet from "../../hooks/useWallet";
import React, { useEffect } from "react";
import { Lock } from "../../types/lock";
import { getImageUrlfromTokenSymbol } from "../../utils/common/getTokenImage";
import CountdownTimer from "./CountdownTimer";
import ProgressBar from "./ProgressBar";

const MyLockedAssets = ({
  selectLock,
  activeLocks,
  fetchActiveLocks,
  indexTokenSymbol,
  lpTokenPrice,
}: {
  selectLock: (lock: Lock) => void;
  activeLocks: Lock[];
  fetchActiveLocks: () => void;
  indexTokenSymbol: string;
  lpTokenPrice: number;
}) => {
  const { account } = useWallet();

  useEffect(() => {
    fetchActiveLocks();
  }, [account]);

  const sortedLocks = [...activeLocks].sort(
    (a, b) => a.unlockDate - b.unlockDate
  );

  return (
    <div className="flex flex-col gap-2 mt-2">
      <p className="text-base-gray text-center">My Locked Assets</p>
      <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
        {sortedLocks.map((lock, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row relative px-4 py-2 justify-between items-start sm:items-center w-full bg-input-grad border-cardborder border-2 rounded hover:opacity-75 cursor-pointer gap-2 sm:gap-0"
            onClick={() => selectLock(lock)}
          >
            <div className="flex flex-row gap-2 items-center">
              <p className="text-printer-gray font-bold">#{i + 1}</p>
              <img
                src={getImageUrlfromTokenSymbol(indexTokenSymbol)}
                alt="LP Token Logo"
                width={22}
                height={22}
                className="rounded-full"
              />
              <p className="text-printer-gray font-bold">
                {`${formatFloatWithCommas(
                  contractDecimals(lock.depositAmount, 18)
                )}`}
              </p>
              <p className="text-printer-gray text-sm font-bold">
                {`($${formatFloatWithCommas(
                  contractDecimals(lock.depositAmount, 18) * lpTokenPrice
                )})`}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col gap-1 items-end">
              <p className="text-printer-gray text-sm">Unlock in:</p>
              <CountdownTimer unlockDate={lock.unlockDate} />
            </div>
            <ProgressBar unlockDate={lock.unlockDate} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLockedAssets;
