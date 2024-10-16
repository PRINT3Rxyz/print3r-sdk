import { useState, useEffect } from "react";
import CheckAnimation from "../animations/CheckAnimation";
import LoadingAnimation from "../animations/LoadingAnimation";
import ModalClose from "../common/ModalClose";
import ModalV2 from "../common/ModalV2";
import FailAnimation from "../animations/FailAnimation";

const TransactionPending = ({
  isOpen,
  setIsOpen,
  steps,
  currentStep,
  hasFailedAtCurrentStep,
  onClose,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  steps: Array<{
    text: string;
    subtext: string;
    failedText: string;
    failedSubtext: string;
    successText: string;
    successSubtext: string;
  }>;
  currentStep: number;
  hasFailedAtCurrentStep: boolean;
  onClose: () => void;
}) => {
  const [stepStatus, setStepStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const [dots, setDots] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stepStatus === "pending") {
      interval = setInterval(() => {
        setDots((prevDots) => (prevDots + 1) % 4);
      }, 500); // Change dot every 500ms
    }
    return () => clearInterval(interval);
  }, [stepStatus]);

  useEffect(() => {
    if (isOpen) {
      if (hasFailedAtCurrentStep) {
        setStepStatus("failed");
      } else if (currentStep >= steps.length) {
        setStepStatus("success");
      } else {
        setStepStatus("pending");
      }
    } else {
      // Reset the state when the modal is closed
      setStepStatus("pending");
    }
  }, [currentStep, hasFailedAtCurrentStep, steps.length, isOpen]);

  const currentStepData = steps[Math.min(currentStep, steps.length - 1)];

  const handleClose = () => {
    onClose();
    setIsOpen(false);
  };

  const getWaitingText = () => {
    return "Waiting for confirmation" + ".".repeat(dots);
  };

  return (
    <ModalV2 isOpen={isOpen} setIsModalOpen={() => setIsOpen} size="md">
      <div className="p-6 w-full h-full">
        <div className="flex flex-row w-full justify-between items-center py-2 border-b border-cardborder">
          <p>{`Transaction ${
            stepStatus === "pending"
              ? "Pending"
              : stepStatus === "success"
              ? "Successful"
              : "Failed"
          } ${currentStep >= steps.length ? steps.length : currentStep + 1}/${
            steps.length
          }`}</p>
          <ModalClose onClose={handleClose} />
        </div>
        <div className="flex flex-col w-full h-full items-center justify-center gap-6">
          {stepStatus === "pending" ? (
            <LoadingAnimation />
          ) : stepStatus === "success" ? (
            <CheckAnimation />
          ) : (
            <FailAnimation />
          )}
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-lg font-bold">
              {stepStatus === "pending"
                ? currentStepData.text
                : stepStatus === "failed"
                ? currentStepData.failedText
                : currentStepData.successText}
            </p>
            <p className="text-sm text-gray-text font-light">
              {stepStatus === "pending"
                ? currentStepData.subtext
                : stepStatus === "failed"
                ? currentStepData.failedSubtext
                : currentStepData.successSubtext}
            </p>
          </div>
          <p
            className={`text-sm ${
              stepStatus === "pending"
                ? "text-gray-text"
                : stepStatus === "failed"
                ? "text-red-500"
                : "text-printer-green"
            } font-light`}
          >
            {stepStatus === "pending"
              ? getWaitingText()
              : stepStatus === "failed"
              ? "Failed!"
              : "Confirmed!"}
          </p>
        </div>
      </div>
    </ModalV2>
  );
};

export default TransactionPending;
