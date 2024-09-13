import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import AnimateHeight from 'react-animate-height';
import { twJoin } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus } from '@awesome.me/kit-7993323d0c/icons/classic/regular';
import PropTypes from 'prop-types';

/**
 * An accordion component allowing users to expand and collapse sections of content.
 */
export const Accordion = ({ title, children }) => (
	<Disclosure>
		{({ open }) => (
			<div className="my-2 [&_p:last-child]:mb-0">
				<DisclosureButton
					className={twJoin(
						'mb-1 inline-flex w-full cursor-pointer items-center justify-between gap-2 p-2.5 px-5 text-left text-xl transition-colors hover:bg-blue hover:text-white focus:bg-blue focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2',
						open ? 'bg-blue text-white' : 'bg-grey-50 text-blue',
					)}
				>
					<span>{title}</span>
					<FontAwesomeIcon
						icon={open ? faCircleMinus : faCirclePlus}
						className={twJoin('h-[1em] text-yellow transition-transform', !open && 'rotate-90')}
					/>
				</DisclosureButton>
				<AnimateHeight height={open ? 'auto' : 0} duration={200} easing={'ease-in-out'}>
					<DisclosurePanel static className="border-l-4 border-yellow py-3 pl-5">
						{children}
					</DisclosurePanel>
				</AnimateHeight>
			</div>
		)}
	</Disclosure>
);

Accordion.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	children: PropTypes.node,
};
