import { CloseButton, Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { twJoin } from "tailwind-merge";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@awesome.me/kit-7993323d0c/icons/classic/solid";

export const Modal = ({ open, onClose = () => {}, role = "dialog", labelledBy, centered, children }) => (
  <Dialog
    transition
    open={open}
    role={role}
    onClose={onClose}
    className="relative z-50 transition duration-300 ease-out data-closed:opacity-0"
    aria-labelledby={labelledBy}
  >
    <DialogBackdrop
      transition
      className="fixed inset-0 bg-black/40 transition duration-300 ease-out data-closed:opacity-0"
    />

    <div className="fixed inset-0 flex w-screen justify-center p-4 pt-6">
      <div className="relative">
        <DialogPanel className={twJoin("h-fit w-fit", centered && "my-auto")}>{children}</DialogPanel>

        <CloseButton
          onClick={onClose}
          className="text-xl text-white bg-gray-950 w-9 h-9 flex items-center justify-center rounded-full absolute top-0 right-0 md:-top-4 md:-right-4 hover:bg-red transition-colors"
        >
          <span className="sr-only">Close</span>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
      </div>
    </div>
  </Dialog>
);

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.string,
  labelledBy: PropTypes.string,
  centered: PropTypes.bool,
  children: PropTypes.node,
};
