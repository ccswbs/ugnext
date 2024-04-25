import { Disclosure } from '@headlessui/react';
import AnimateHeight from 'react-animate-height';
import { useEffect, useRef } from 'react';
const Accordion = ({ text, children }) => {
	const panel = useRef(null);

	useEffect(() => {}, []);

	return (
		<Disclosure>
			{({ open }) => (
				<>
					<Disclosure.Button className="mb-1 inline-flex w-full cursor-pointer items-center justify-between text-xl font-semibold text-neutral-800">
						{text}
					</Disclosure.Button>
					<AnimateHeight height={open ? 'auto' : 0} duration={200} easing={'ease-in-out'}>
						<Disclosure.Panel static ref={panel}>
							{children}
						</Disclosure.Panel>
					</AnimateHeight>
				</>
			)}
		</Disclosure>
	);
};

export default Accordion;
