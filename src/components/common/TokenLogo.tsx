import { getImageUrlfromTokenSymbol } from "../../utils/common/getTokenImage";

type Props = {
  tokenSymbol: string;
  className?: string;
  tokenName?: string;
  tokenImageClass?: string;

  tokenNameClass?: string;
  tokenSymbolClass?: string;
  showBracket?: boolean;
};

const TokenLogo = ({
  tokenSymbol,
  className,
  tokenName,
  tokenImageClass,
  tokenNameClass,
  tokenSymbolClass,
  showBracket,
}: Props) => {
  return (
    <div className={`flex gap-2 items-center ${className ? className : ""}`}>
      <img
        className={`${
          tokenImageClass ? tokenImageClass : "w-5 h-5 rounded-full"
        }`}
        width={128}
        height={128}
        src={getImageUrlfromTokenSymbol(tokenSymbol)}
        alt={`${tokenSymbol} Token`}
      />
      {tokenName && (
        <p className={`${tokenNameClass ? tokenNameClass : ""}`}>{tokenName}</p>
      )}
      <p className={`${tokenSymbolClass ? tokenSymbolClass : ""}`}>
        {showBracket ? `(${tokenSymbol})` : tokenSymbol}
      </p>
    </div>
  );
};

export default TokenLogo;
