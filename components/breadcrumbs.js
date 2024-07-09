import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@awesome.me/kit-7993323d0c/icons/sharp/light';
import { faChevronRight } from '@awesome.me/kit-7993323d0c/icons/classic/light';
import Link from 'next/link';
import { Container } from '@/components/container';

export const Breadcrumbs = ({ links }) => (
	<Container centered>
		<ol className="flex items-center gap-2 flex-wrap w-full">
			<li>
				<Link href="/">
					<FontAwesomeIcon icon={faHome} className="h-[1em] fill-black" />
				</Link>
			</li>
			{links?.map((link, index) => (
				<li key={index} className="flex items-center gap-2">
					<FontAwesomeIcon icon={faChevronRight} className="h-[.75em]" />
					{index === links.length - 1 ? <span>{link.title}</span> : <Link href={link.url}>{link.title}</Link>}
				</li>
			))}
		</ol>
	</Container>
);
