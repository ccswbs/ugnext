import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { twJoin } from 'tailwind-merge';

export const Modal = ({ open, onClose, role = 'dialog', labelledBy, centered, children }) => (
	<Transition
		show={open}
		enter="duration-200 ease-out"
		enterFrom="opacity-0"
		enterTo="opacity-100"
		leave="duration-300 ease-out"
		leaveFrom="opacity-100"
		leaveTo="opacity-0"
	>
		<Dialog role={role} onClose={onClose} className="relative z-50" aria-labelledby={labelledBy}>
			<div className="fixed inset-0 bg-black/40" aria-hidden="true" />

			<div className="fixed inset-0 flex w-screen justify-center p-4">
				<DialogPanel className={twJoin('h-fit w-fit', centered && 'my-auto')}>{children}</DialogPanel>
			</div>
		</Dialog>
	</Transition>
);
