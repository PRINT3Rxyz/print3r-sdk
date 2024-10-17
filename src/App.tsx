import React from "react";
import { Providers } from "./providers/providers";
import NavBar from "./components/nav/NavBar";
import { ToastContainer } from "react-toastify";
import TradePage from "./components/TradePage";
import { SDKOptions } from "./types/index";

const App: React.FC<SDKOptions> = ({
  customId,
  colorScheme,
  chainName,
  logo,
}) => {
  return (
    <>
      <Providers>
        <NavBar logo={logo} />
        <TradePage customId={customId} chainName={chainName} />
      </Providers>
      <ToastContainer
        className={"text-sm"}
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
