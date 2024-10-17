import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import useWindowSize from "../../hooks/useWindowSize";

type ModalV2Props = {
  isOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  placement?:
    | "center"
    | "auto"
    | "top"
    | "top-center"
    | "bottom"
    | "bottom-center"
    | undefined;
  style?: "default" | "secondary";
  fullScreenOnMobile?: boolean;
};

const ModalV2 = ({
  isOpen,
  setIsModalOpen,
  children,
  size = "xl",
  placement,
  style = "default",
  fullScreenOnMobile = true,
}: ModalV2Props) => {
  const { width } = useWindowSize();

  const isMobile = width && width < 768;
  const fullHeight = fullScreenOnMobile && isMobile;

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      backdrop="blur"
      placement={placement ? placement : "center"}
      hideCloseButton={true}
      size={isMobile && fullScreenOnMobile ? "full" : size}
      radius="lg"
      shadow="lg"
      className={`${fullHeight ? "h-full max-h-screen" : ""} overflow-x-hidden`}
      classNames={{
        body:
          style === "default"
            ? "bg-card-grad h-full shadow-lg pb-10 md:p-0 rounded-lg overflow-x-hidden"
            : "bg-input-grad h-full shadow-lg pb-10 md:p-0 rounded-lg overflow-x-hidden",
        base: `rounded-lg border-cardborder border-2 modal-gradient-shadow ${
          fullHeight ? "h-full max-h-screen" : ""
        } overflow-x-hidden`,
        backdrop: "bg-black/50 backdrop-opacity-40",
        wrapper: fullHeight ? "h-full max-h-screen overflow-x-hidden" : "",
      }}
    >
      <ModalContent
        className={`${fullHeight ? "h-full" : ""} overflow-x-hidden`}
      >
        <ModalBody
          className={`${fullHeight ? "h-full p-0" : ""} ${
            isMobile ? "pb-20" : ""
          } overflow-x-hidden`}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalV2;
