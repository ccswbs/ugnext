import { twJoin, twMerge } from 'tailwind-merge';
import { useContext, createContext } from 'react';

const ListContext = createContext(null);

export const List = ({ variant = 'unordered', children, className, ...rest }) => {
	const Tag = variant === 'ordered' ? 'ol' : 'ul';
	const context = useContext(ListContext);

	return (
		<Tag
			{...rest}
			className={twMerge(
				twJoin(
					'my-2 flex flex-col gap-1',
					variant === 'ordered' && 'gap-2 [counter-reset:list-number]',
					context?.nested && 'mt-0',
				),
				className,
			)}
		>
			<ListContext.Provider value={{ variant, nested: typeof context === 'object' }}>{children}</ListContext.Provider>
		</Tag>
	);
};

export const ListItem = ({ children }) => {
	const { variant } = useContext(ListContext);

	return (
		<li
			className={twJoin(
				'h-fit w-full has-[ol]:before:content-none has-[ul]:before:content-none',
				variant !== 'ordered' &&
					'relative pl-8 before:absolute before:left-[.5rem] before:top-[0.35rem] before:block before:h-[1.8rem] before:w-[1.1rem] before:shrink-0 before:items-center before:justify-center before:text-yellow before:content-[url("/icons/chevron-right.svg")]',
				variant === 'ordered' &&
					'relative pl-8 before:absolute before:left-0 before:inline-flex before:h-6 before:w-6 before:shrink-0 before:items-center before:justify-center before:bg-yellow before:font-black before:text-black before:content-[counter(list-number)] before:[counter-increment:list-number]',
			)}
		>
			{children}
		</li>
	);
};
