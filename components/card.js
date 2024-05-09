import { twJoin } from 'tailwind-merge';

export const Card = ({ href, children }) => {
	const Tag = href ? 'a' : 'div';

	return <Tag className={twJoin('rounded-lg bg-white p-6 shadow-md')}>{children}</Tag>;
};
