import React from "react";
import { Order } from "../../types/positions";
import { Button } from "@nextui-org/react";
import TokenLogo from "../common/TokenLogo";
import { getPriceDecimals } from "../../utils/web3/utils";
import ModalClose from "../common/ModalClose";
import useWallet from "../../hooks/useWallet";
import { cancelLimitOrder } from "../../utils/web3/cancelLimitOrder";
import { helperToast } from "../../utils/common/helperToast";

interface OrderDetailsModalProps {
  order: Order;
  markPrice: number;
  onClose: () => void;
  triggerGetTradeData: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  markPrice,
  onClose,
  triggerGetTradeData,
}) => {
  const priceDecimals = getPriceDecimals(markPrice);
  const symbol = order.symbol.split(":")[0];

  const { account, chainId, smartAccount } = useWallet();

  const handleCancelClick = async (order: Order) => {
    if (!account || !smartAccount) return;
    try {
      await cancelLimitOrder(chainId, account, order, smartAccount);

      triggerGetTradeData();

      helperToast.success("Order Cancelled ✅");
    } catch (error) {
      console.error(error);
      helperToast.error("Error Cancelling Order ❌");
    }
    onClose();
    triggerGetTradeData();
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 justify-around h-full py-10">
      <div className="w-full flex items-start justify-end">
        <ModalClose onClose={onClose} />
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Symbol</span>
        <span>{`${symbol}/USD`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Order Type</span>
        <span>{order.orderType}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Size</span>
        <span>{`${order.size.toFixed(2)} USD`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Trigger Price</span>
        <span>{`$${order.triggerPrice.toFixed(priceDecimals)}`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Mark Price</span>
        <span>{`$${markPrice.toFixed(priceDecimals)}`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Time Created</span>
        <span>{order.timeCreated}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Collateral Asset</span>
        <TokenLogo tokenSymbol={order.isLong ? "ETH" : "USDC"} />
      </div>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => handleCancelClick(order)}
          className="bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 font-bold text-white px-4 py-2"
        >
          Cancel Order
        </Button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
