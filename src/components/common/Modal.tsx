import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RemoveScroll } from "react-remove-scroll";
import { MdClose } from "react-icons/md";

type ModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  className?: string;
  zIndex?: number;
  onAfterOpen?: () => void;
  lockClosing?: boolean;
  hideCloseButton?: boolean;
  label?: React.ReactNode;
  headerContent?: () => React.ReactNode;
  children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = (props) => {
  const {
    isVisible,
    setIsVisible,
    className,
    zIndex,
    onAfterOpen,
    lockClosing,
    hideCloseButton,
    label,
    headerContent,
    children,
  } = props;

  const modalRef = useRef(null);

  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape" && setIsVisible && !lockClosing) {
        setIsVisible(false);
      }
    }
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [setIsVisible, lockClosing]);

  useEffect(() => {
    if (typeof onAfterOpen === "function") onAfterOpen();
  }, [onAfterOpen]);

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center text-left ${className}`}
          style={{ zIndex: zIndex || 100 }} // Adjust zIndex to a high value for the modal container
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={fadeVariants}
          transition={{ duration: 0.2 }}
        >
          <div
            className="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-90"
            style={{ zIndex: 11 }} // Set zIndex to cover elements with zIndex > 10
            onClick={() => {
              if (!lockClosing) {
                setIsVisible(false);
              }
            }}
          ></div>
          <div className="relative z-50 max-w-full max-h-[90vh] overflow-auto bg-card-grad rounded-3 border-2 border-cardborder">
            <div className="m-6 mt-0">
              <div className="flex justify-between items-center pt-6">
                <div className="text-left text-lg font-bold">{label}</div>
                {!hideCloseButton && (
                  <div
                    className="cursor-pointer text-printer-orange text-3xl opacity-60 hover:opacity-90"
                    onClick={() => setIsVisible(false)}
                  >
                    <MdClose fontSize={20} />
                  </div>
                )}
              </div>
              {headerContent && headerContent()}
            </div>
            <RemoveScroll>
              <div
                className="max-h-[calc(80vh-8.5rem)] overflow-y-auto pr-1.5"
                ref={modalRef}
              >
                {children}
              </div>
            </RemoveScroll>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
