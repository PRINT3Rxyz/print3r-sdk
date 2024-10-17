import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SDKOptions } from "./types";

export const initTradeSDK = (element: HTMLElement, options: SDKOptions) => {
  const root = ReactDOM.createRoot(element);
  root.render(
    <React.StrictMode>
      <App
        customId={options.customId}
        colorScheme={options.colorScheme}
        customColors={options.customColors}
      />
    </React.StrictMode>
  );
};

if (typeof window !== "undefined") {
  (window as any).ReactTradeSDK = {
    initTradeSDK,
  };
}
