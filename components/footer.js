import { useEffect } from 'react';
const Footer = () => {
	useEffect(() => {
		import('@uoguelph/web-components/uofg-footer');
	}, []);

	return <uofg-footer></uofg-footer>;
};

export default Footer;
