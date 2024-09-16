import React from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { Modal } from '@/components/modal';
import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Container } from '@/components/container';

const APP_ARMOR_ALERT_KEY = 'app-armor-alert';
const APP_ARMOR_ALERT_DISMISS_ALERT_KEY = 'app-armor-alert-dismiss';

const isAlertEqual = (a, b) => {
	return a?.time === b?.time;
};

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
					// Try to parse the content App Armor loads into the DOM as a JSON object.
					const child = ref.current.firstChild;
					let newAlert = null;

					try {
						newAlert = JSON.parse(child.textContent);
					} catch (e) {
						// There is no active alert, clear the local storage.
						window?.localStorage?.removeItem(APP_ARMOR_ALERT_KEY);
						window?.localStorage?.removeItem(APP_ARMOR_ALERT_DISMISS_ALERT_KEY);
						return;
					}

					// Try to get an existing alert from the browser's local storage.
					let oldAlert = window?.localStorage?.getItem(APP_ARMOR_ALERT_KEY);

					try {
						oldAlert = JSON.parse(oldAlert);
					} catch (e) {
						// There is No old alert, the user hasn't seen the new alert yet and we should show it
						setAlert(newAlert);
						setShow(true);
						window?.localStorage?.setItem(APP_ARMOR_ALERT_KEY, JSON.stringify(newAlert));
						window?.localStorage?.removeItem(APP_ARMOR_ALERT_DISMISS_ALERT_KEY);
						return;
					}

					// At this point there is a new alert, and we have stored an older one,
					// We need to check if the new and old ones are the same
					if (isAlertEqual(oldAlert, newAlert)) {
						// If the old and new alerts are the same, then we need to check if the user asked to not see it again.
						const dismissed = window?.localStorage?.getItem(APP_ARMOR_ALERT_DISMISS_ALERT_KEY) === 'true';

						if (dismissed) {
							return;
						}

						// Otherwise we will still show them the alert.
						setAlert(newAlert);
						setShow(true);

						return;
					}

					// The alerts aren't the same so we show the user the new alert.
					window?.localStorage?.removeItem(APP_ARMOR_ALERT_DISMISS_ALERT_KEY);
					window?.localStorage?.setItem(APP_ARMOR_ALERT_KEY, JSON.stringify(newAlert));
					setAlert(newAlert);
					setShow(true);
				}}
			></Script>

			{alert && (
				<Modal open={show} onClose={() => setShow(false)}>
					<Container centered className="p-0 !max-w-[80rem]">
						<Alert
							title="University of Guelph Alert"
							subtitle={alert.title}
							message={alert.description}
							footer={
								<div className="flex flex-col gap-2 md:flex-row items-center justify-between w-full">
									<span>{`Last Updated: ${alert.time}`}</span>
									<Button
										color="red"
										className="py-2"
										onClick={() => {
											setShow(false);
											window?.localStorage?.setItem(APP_ARMOR_ALERT_DISMISS_ALERT_KEY, 'true');
										}}
									>
										Don&apos;t show me this again
									</Button>
								</div>
							}
						/>
					</Container>
				</Modal>
			)}
		</>
	);
};

export default AppArmor;
