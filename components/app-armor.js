import React from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { Modal } from '@/components/modal';
import { Alert } from '@/components/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@awesome.me/kit-7993323d0c/icons/classic/regular';
import { Button } from '@/components/button';
import Banner from '@/components/banner';
import { faX } from '@awesome.me/kit-7993323d0c/icons/classic/solid';

const AppArmor = () => {
	const { isPreview, isFallback } = useRouter();
	const id = isPreview || process.env.NODE_ENV !== 'production' ? 168 : 169;
	const ref = React.useRef(null);
	const [alert, setAlert] = React.useState(null);
	const [show, setShow] = React.useState(false);

	return (
		<>
			<div id={`AppArmorAlertID_${id}`} ref={ref}></div>

			<Script
				strategy="afterInteractive"
				src={`https://uoguelph.apparmor.com/Notifications/Feeds/Javascript/?AlertID=${id}`}
				onLoad={() => {
					const child = ref.current.firstChild;

					if (child) {
						try {
							const data = JSON.parse(child.textContent);
							setAlert(data);
						} catch (e) {
							console.error('Failed to load App Armor Alert due to JSON parsing error.');
						}
					}
				}}
			></Script>

			{alert && (
				<>
					<Banner color="red" className="p-0">
						<Button className="p-3 text-lg flex-1" onClick={() => setShow(true)} color="red">
							<FontAwesomeIcon icon={faCircleExclamation} className="text-2xl" />
							<span>&nbsp;{alert.title}&nbsp;</span>
						</Button>

						<Button
							color="none"
							className="flex absolute p-2 w-fit aspect-square right-2 top-1/2 -translate-y-1/2 mr-2"
						>
							<FontAwesomeIcon icon={faX} className="text-sm" />
						</Button>
					</Banner>

					<Modal open={show} onClose={() => setShow(false)}>
						<Alert
							title="University of Guelph Alert"
							subtitle={alert.title}
							message={alert.description}
							footer={`Last Updated: ${alert.time}`}
						/>
					</Modal>
				</>
			)}
		</>
	);
};

export default AppArmor;
