import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { twJoin } from 'tailwind-merge';
import PropTypes from 'prop-types';

export const Modal = ({ open, onClose = () => {}, role = 'dialog', labelledBy, centered, children }) => (
	<Dialog
		transition
		open={open}
		role={role}
		onClose={onClose}
		className="relative z-50 transition duration-300 ease-out data-[closed]:opacity-0"
		aria-labelledby={labelledBy}
	>
		<DialogBackdrop
			transition
			className="fixed inset-0 bg-black/40 transition duration-300 ease-out data-[closed]:opacity-0"
		/>

		<div className="fixed inset-0 flex w-screen justify-center p-4">
			<DialogPanel className={twJoin('h-fit w-fit', centered && 'my-auto')}>{children}</DialogPanel>
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
