import { useMemo } from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import { Link } from '@/components/link';
import { Heading } from '@/components/heading';
import { List, ListItem } from '@/components/list';
import { Divider } from '@/components/divider';
import '@/lib/font-awesome';

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const parser = new Parser();
export const DEFAULT_PROCESSOR = new ProcessNodeDefinitions().processDefaultNode;
export const DEFAULT_INSTRUCTIONS = [
	// h1, h2, ... h6 tags
	{
		shouldProcessNode: (node) => headingTags.has(node.tagName),
		processNode: (node, children) => {
			const level = /h(\d)/.exec(node.tagName)?.[1];
			return (
				<Heading {...node.attribs} level={level}>
					{children}
				</Heading>
			);
		},
	},
	// Links
	{
		shouldProcessNode: (node) => node.tagName === 'a' && typeof node.attribs?.href === 'string',
		processNode: (node, children) => (
			<Link {...node.attribs} href={node.attribs?.href ?? ''}>
				{children}
			</Link>
		),
	},
	// Lists
	{
		shouldProcessNode: (node) => node.tagName === 'ul' || node.tagName === 'ol',
		processNode: (node, children) => (
			<List {...node.attribs} variant={node.tagName === 'ol' ? 'ordered' : 'unordered'}>
				{children
					.filter((child) => child.type === 'li')
					.map((child, index) => (
						<ListItem key={index}>{child.props?.children}</ListItem>
					))}
			</List>
		),
	},
	// Divider
	{
		shouldProcessNode: (node) => node.tagName === 'hr',
		processNode: (node) => <Divider />,
	},
	// Fallback
	{
		shouldProcessNode: () => true,
		processNode: DEFAULT_PROCESSOR,
	},
];

export const HtmlParser = ({ html, instructions }) => {
	return useMemo(() => {
		return parser.parseWithInstructions(
			html,
			() => true,
			Array.isArray(instructions) ? instructions : DEFAULT_INSTRUCTIONS,
		);
	}, [html, instructions]);
};
