import { Disclosure } from '@headlessui/react';
import AnimateHeight from 'react-animate-height';
import { twJoin } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus } from '@awesome.me/kit-7993323d0c/icons/classic/regular';
const Accordion = ({ text, children }) => {
	const containerClasses = twJoin('my-2');
	const buttonClasses = twJoin(
		'mb-1 inline-flex w-full cursor-pointer items-center justify-between p-2.5 px-5 text-xl transition-colors hover:bg-blue hover:text-white focus:bg-blue focus:text-white focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus:outline-none'
	);
	const iconClasses = twJoin('h-[1em] text-yellow transition-transform');
	const panelClasses = twJoin('border-l-4 border-yellow py-2 pl-3');

	return (
		<Disclosure>
			{({ open }) => (
				<div className={containerClasses}>
					<Disclosure.Button className={twJoin(buttonClasses, open ? 'bg-blue text-white' : 'bg-grey-50 text-blue')}>
						<span>{text}</span>
						{open ? (
							<FontAwesomeIcon icon={faCircleMinus} className={iconClasses} />
						) : (
							<FontAwesomeIcon icon={faCirclePlus} className={twJoin(iconClasses, 'rotate-90')} />
						)}
					</Disclosure.Button>
					<AnimateHeight height={open ? 'auto' : 0} duration={200} easing={'ease-in-out'}>
						<Disclosure.Panel static className={panelClasses}>
							{children}
						</Disclosure.Panel>
					</AnimateHeight>
				</div>
			)}
		</Disclosure>
	);
};

export default Accordion;
