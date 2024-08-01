import { Heading } from '@/components/heading';
import { List, ListItem } from '@/components/list';
import { Link } from '@/components/link';

export const Sidebar = () => (
	<div className="flex flex-col pl-8 mt-5">
		<Heading level={3} as="h2" className="mb-1">
			More Information
		</Heading>
		<List className="text-lg">
			<ListItem>
				<Link className="block pt-0 w-fit" href="https://www.uoguelph.ca/apply/">
					How to apply
				</Link>
			</ListItem>
			<ListItem>
				<Link className="block pt-0 w-fit" href="/programs/undergraduate">
					Search for a program
				</Link>
			</ListItem>
			<ListItem>
				<Link className="block pt-0 w-fit" href="https://admission.uoguelph.ca/2c042408-ce57-40b8-9689-192f685e8909">
					English Proficiency Requirements
				</Link>
			</ListItem>
			<ListItem>
				<Link className="block pt-0 w-fit" href="https://admission.uoguelph.ca/canadian/courseselect">
					Next Steps
				</Link>
			</ListItem>
			<ListItem>
				<Link className="block pt-0 w-fit" href="https://admission.uoguelph.ca/alternateoffers">
					Alternate Offers
				</Link>
			</ListItem>
			<ListItem>
				<Link className="block pt-0 w-fit" href="https://admission.uoguelph.ca/canadian/finassist">
					Financial Assistance
				</Link>
			</ListItem>
		</List>
	</div>
);
