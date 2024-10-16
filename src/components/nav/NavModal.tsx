import React from "react";
import ModalV2 from "../common/ModalV2";
import ModalClose from "../common/ModalClose";

type NavModalProps = {
  isOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  introParagraph?: string;
};

const NavModal: React.FC<NavModalProps> = ({
  isOpen,
  setIsModalOpen,
  title,
  children,
  image,
  imageWidth,
  imageHeight,
  imageAlt,
  introParagraph,
}) => {
  return (
    <ModalV2 isOpen={isOpen} setIsModalOpen={setIsModalOpen}>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-end">
          <ModalClose onClose={() => setIsModalOpen(false)} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <img
            src={image}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
          />
          <h2 className="text-lg font-semibold mt-4">{title}</h2>
          <p className="text-sm text-center font-normal text-printer-gray">
            {introParagraph}
          </p>
        </div>
        {children}
      </div>
    </ModalV2>
  );
};

export default NavModal;
