import '@/styles/globals.css';
import { GoogleTagManager } from '@next/third-parties/google';
import { useRouter } from 'next/router';

function Application({ Component, pageProps }) {
	const { isPreview } = useRouter();

	return (
		<>
			<Component {...pageProps} />;
			<GoogleTagManager gtmId={process.env.GTM_ID} />
			{/* {process.env.NODE_ENV === 'production' && !isPreview && <GoogleTagManager gtmId={process.env.GTM_ID} />} */}
		</>
	);
}

export default Application;
