import '@/styles/globals.css';
import { GoogleTagManager } from '@next/third-parties/google';

function Application({ Component, pageProps }) {
	return (
		<>
			<Component {...pageProps} />;
			<GoogleTagManager gtmId={process.env.GTM_ID} />
			{/* {process.env.NODE_ENV === 'production' && <GoogleTagManager gtmId={process.env.GTM_ID} />} */}
		</>
	)
}

export default Application;
