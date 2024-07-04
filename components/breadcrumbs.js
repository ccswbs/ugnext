import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@awesome.me/kit-7993323d0c/icons/sharp/thin';
import Link from 'next/link';

export const Breadcrumbs = ({ links }) => (
	<ul className="flex gap-2">
		<Link href="/">
			<FontAwesomeIcon icon={faHome} />
		</Link>
		{links.map((link, index) => (
			<li key={index}>
				<FontAwesomeIcon icon={faChevronRight} />
				{index === links.length - 1 ? <span>{link.title}</span> : <Link href={link.url}>{link.title}</Link>}
			</li>
		))}
	</ul>
);
