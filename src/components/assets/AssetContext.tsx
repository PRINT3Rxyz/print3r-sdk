import React, { createContext, useContext } from "react";
import { Asset } from "../../types/assets";

interface AssetContextProps {
  asset: Asset | null;
  setAsset: (asset: Asset) => void;
}

const AssetContext = createContext<AssetContextProps | undefined>(undefined);

export const AssetProvider: React.FC<
  AssetContextProps & { children: React.ReactNode }
> = ({ asset, setAsset, children }) => {
  return (
    <AssetContext.Provider
      value={{
        asset,
        setAsset,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAsset must be used within an AssetProvider");
  }
  return context;
};
