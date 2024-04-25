import { Disclosure } from '@headlessui/react';
import AnimateHeight from 'react-animate-height';
import { twJoin } from 'tailwind-merge';
const Accordion = ({ text, children }) => (
	<Disclosure>
		{({ open }) => (
			<>
				<Disclosure.Button
					className={twJoin(
						'mb-1 inline-flex w-full cursor-pointer items-center justify-between p-2.5 px-5 text-xl transition-colors hover:bg-blue hover:text-white focus:bg-blue focus:text-white',
						open ? 'bg-blue text-white' : 'bg-blue-50 text-blue',
					)}
				>
					<span>{text}</span>
					<i
						className={twJoin(
							'fa-regular text-yellow transition-transform duration-200',
							open ? 'fa-circle-minus' : 'fa-circle-plus rotate-90',
						)}
					></i>
				</Disclosure.Button>
				<AnimateHeight height={open ? 'auto' : 0} duration={200} easing={'ease-in-out'}>
					<Disclosure.Panel static className="border-l-4 border-yellow py-2 pl-3">
						{children}
					</Disclosure.Panel>
				</AnimateHeight>
			</>
		)}
	</Disclosure>
);

export default Accordion;
