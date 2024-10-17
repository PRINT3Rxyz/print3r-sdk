import React, { useEffect, useState } from "react";
import ConnectWallet from "./ConnectWallet";
import { useDisconnect } from "wagmi";
import { watchAccount } from "wagmi/actions";
import { wagmi_config } from "../../providers/providers";
import {
  CHAIN_IMAGES,
  CHAIN_NAMES,
  SUPPORTED_CHAIN_IDS,
} from "../../utils/web3/config";
import { useChainModal } from "@rainbow-me/rainbowkit";
import { helperToast } from "../../utils/common/helperToast";
import useWallet from "../../hooks/useWallet";
import {
  getTotalUsers,
  getUserData,
  updateUserData,
} from "../../utils/redux/getUserData";
import { useAppDispatch } from "../../utils/redux/hooks";
import { setUserData } from "../../utils/redux/reducers/userSlice";
import { getLeaderBoardData } from "../../utils/redux/getLeaderboardData";
import {
  setLeaderBoardData,
  setTotalUsers,
} from "../../utils/redux/reducers/leaderBoardSlice";
import { BsChevronDown } from "react-icons/bs";
import useWindowSize from "../../hooks/useWindowSize";

const NavBar: React.FC<{ logo: string }> = ({ logo }) => {
  const [currentChainImg, setCurrentChainImg] = useState<string | null>(null);

  const { disconnect } = useDisconnect();
  const { openChainModal, chainModalOpen } = useChainModal();
  const dispatch = useAppDispatch();
  const { account, chainId } = useWallet();

  const { width } = useWindowSize();

  useEffect(() => {
    if (account) {
      fetchUserData(account);

      setTimeout(() => {
        fetchLeaderBoardData(account);
        fetchTotalUsers();
      }, 1000);
      setTimeout(() => {
        updateUserData(account, chainId);
      }, 5000);

      setInterval(() => {
        fetchUserData(account);
        setTimeout(() => {
          fetchLeaderBoardData(account);
          fetchTotalUsers();
        }, 1000);
        setTimeout(() => {
          updateUserData(account, chainId);
        }, 5000);
      }, 5 * 60 * 1000);
    }
  }, [account]);

  useEffect(() => {
    if (chainId) {
      setCurrentChainImg(CHAIN_IMAGES[chainId]);
    }
  }, [chainId]);

  const fetchUserData = async (account: `0x${string}`) => {
    let userData = await getUserData(account);

    if (userData) {
      dispatch(setUserData(userData));
    }
  };

  const fetchTotalUsers = async () => {
    let totalUsers = await getTotalUsers();

    if (totalUsers) {
      dispatch(setTotalUsers(totalUsers));
    }
  };

  const fetchLeaderBoardData = async (account: `0x${string}`) => {
    let leaderBoardData = await getLeaderBoardData(account);

    if (leaderBoardData) {
      dispatch(setLeaderBoardData(leaderBoardData));
    }
  };

  useEffect(() => {
    const unwatch = watchAccount(wagmi_config, {
      onChange(data: any) {
        const currentChain = data.chainId;
        if (currentChain && !SUPPORTED_CHAIN_IDS.includes(currentChain)) {
          helperToast.error(
            `Connected to Wrong chain. Please Switch to ${wagmi_config.chains[0].name}`
          );
          disconnect();
        }
      },
    });

    return () => unwatch();
  });
  return (
    <nav className="flex flex-col px-2 py-4 gap-2 md:px-8 md:py-2 shadow-2xl h-fit  border-b border-cardborder bg-card-grad text-white w-screen">
      <div className="flex flex-row w-full justify-between items-center mr-4">
        <div className="flex items-center">
          <a className="" href="https://v2-homepage.vercel.app/">
            <img
              src={logo || "/img/nav-logo.png"}
              className="w-32 sm:w-36 md:w-44 h-auto"
              alt="Project Logo"
              // width={128}
              // height={128}
            />
          </a>
        </div>

        <div className="flex space-x-4 items-center">
          <button
            className="bg-input-grad border-cardborder border-2 rounded-3 px-3 h-10 flex items-center justify-between gap-2"
            onClick={() => {
              openChainModal && openChainModal();
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <img
                src={currentChainImg || "/img/chains/base-logo.svg"}
                className="w-5 h-5"
                alt="Chain Logo"
                width={128}
                height={128}
              />

              {width && width > 768 && (
                <p className="text-sm text-white font-semibold">
                  {CHAIN_NAMES[chainId]
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </p>
              )}
            </div>
            <BsChevronDown
              className={`text-printer-orange transition-transform ${
                chainModalOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <ConnectWallet styles="flex items-center bg-p3-button hover:bg-p3-button-hover border-2 border-p3 text-white py-1 px-4 !rounded-3 h-10 trade-first-step" />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
