import { Disclosure, Transition } from '@headlessui/react';
import { useEffect, useRef } from 'react';
const Accordion = ({ text, children }) => {
	const container = useRef(null);
	const panel = useRef(null);

	const updateHeight = (open) => {
		if (container.current && panel.current) {

			if(!open) {
				container.current.style.removeProperty('display');
				container.current.hidden = false;
				panel.current.style.removeProperty('display');
				panel.current.hidden = false;
			}

			let hasVarClass = container.current.classList.contains('h-[var(--accordion-height,auto)]');

			if(hasVarClass) {
				container.current.classList.remove('h-[var(--accordion-height,auto)]')
			}

			const height = container.current.offsetHeight;
			if (height > 0) {
				container.current?.style?.setProperty('--accordion-height', `${height}px`);
			}

			if(hasVarClass) {
				container.current.classList.add('h-[var(--accordion-height,auto)]')
			}

			if (!open) {
				container.current.style.setProperty('display', 'none');
				container.current.hidden = true;
				panel.current.style.setProperty('display', 'none');
				panel.current.hidden = true;
			}
		}
	};

	useEffect(() => {
		updateHeight(true);
	}, []);

	return (
		<Disclosure>
			{({ open }) => (
				<>
					<Disclosure.Button
						onClick={() => console.log(open)}
						className="mb-1 inline-flex w-full cursor-pointer items-center justify-between text-xl font-semibold text-neutral-800"
					>
						{text}
					</Disclosure.Button>

					<Transition
						enter="transition-all duration-200 overflow-hidden"
						enterFrom="h-0 invisible"
						enterTo="h-[var(--accordion-height,auto)] visible"
						leave="transition-all duration-200 overflow-hidden"
						leaveFrom="h-[var(--accordion-height,auto)] visible"
						leaveTo="h-0 invisible"
						unmount={false}
						ref={container}
						onTransitionEnd={() => {open && updateHeight(false); open && console.log('updating height')}}
					>
						<Disclosure.Panel unmount={false} ref={panel}>
							{children}
						</Disclosure.Panel>
					</Transition>
				</>
			)}
		</Disclosure>
	);
};

export default Accordion;
