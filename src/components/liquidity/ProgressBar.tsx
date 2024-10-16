import React, { useEffect, useState } from "react";

const maxLockDuration = 86400000;

const ProgressBar = ({ unlockDate }: { unlockDate: number }) => {
  const [progress, setProgress] = useState(
    100 - (unlockDate / maxLockDuration) * 100
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = Math.max(0, unlockDate - currentTime);
      const newProgress = 100 - (timeLeft / maxLockDuration) * 100;
      setProgress(newProgress);
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockDate]);

  return (
    <div
      className="absolute bottom-0 left-0 h-[4px] bg-printer-orange"
      style={{ width: `${progress}%` }}
    />
  );
};

export default ProgressBar;
