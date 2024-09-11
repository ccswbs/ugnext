import React from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { Modal } from '@/components/modal';
import { Alert } from '@/components/alert';

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
				<Modal open={show} onClose={() => setShow(false)}>
					<Alert
						title="University of Guelph Alert"
						subtitle={alert.title}
						message={alert.description}
						footer={`Last Updated: ${alert.time}`}
					/>
				</Modal>
			)}
		</>
	);
};

export default AppArmor;
