import { useEffect } from 'react';
export default function Footer() {
	useEffect(() => {
		import('@uoguelph/web-components/uofg-footer');
	}, []);

	return <uofg-footer></uofg-footer>;
}
