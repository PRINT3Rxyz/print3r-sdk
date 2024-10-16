import { formatDurationWithLocale } from "../../utils/common/formatters";
import React, { useEffect, useState } from "react";

const CountdownTimer = ({ unlockDate }: { unlockDate: number }) => {
  const [timeLeft, setTimeLeft] = useState(
    unlockDate > Math.floor(Date.now() / 1000)
      ? unlockDate - Math.floor(Date.now() / 1000)
      : 0
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <p className="text-printer-gray font-bold text-nowrap">
      {formatDurationWithLocale(timeLeft)}
    </p>
  );
};

export default CountdownTimer;
