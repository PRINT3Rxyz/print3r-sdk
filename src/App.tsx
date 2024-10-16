import React from "react";
import { Providers } from "./providers/providers";
import NavBar from "./components/nav/NavBar";
import { ToastContainer } from "react-toastify";
import TradePage from "./components/TradePage";

const App: React.FC = () => {
  return (
    <>
      <Providers>
        <NavBar />
        <TradePage />
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
