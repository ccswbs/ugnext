import { Disclosure, Transition } from '@headlessui/react';
import { useEffect, useRef } from 'react';
const Accordion = ({ text, children }) => {
	const container = useRef(null);
	const panel = useRef(null);

	const updateHeight = (reflow) => {
		if (container.current && panel.current) {
			if (reflow) {
				container.current.style.removeProperty('display');
				container.current.hidden = false;
				panel.current.style.removeProperty('display');
				panel.current.hidden = false;
			}

			const height = container.current.offsetHeight;
			if (height > 0) {
				container.current?.style?.setProperty('--accordion-height', `${height}px`);
			}

			if (reflow) {
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
					<Disclosure.Button className="mb-1 inline-flex w-full cursor-pointer items-center justify-between text-xl font-semibold text-neutral-800">
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
						beforeLeave={() => updateHeight(false)}
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
