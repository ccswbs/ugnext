import { useEffect, useMemo, useRef } from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import { Link } from '@/components/link';
import { Heading } from '@/components/heading';
import { List, ListItem } from '@/components/list';
import { Divider } from '@/components/divider';
import '@/lib/font-awesome';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { getHeadingLevel } from '@/lib/string-utils';

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const parser = new Parser();
export const DEFAULT_PROCESSOR = new ProcessNodeDefinitions().processDefaultNode;
export const DEFAULT_INSTRUCTIONS = [
	// h1, h2, ... h6 tags
	{
		shouldProcessNode: (node) => headingTags.has(node.tagName),
		processNode: (node, children) => {
			const level = getHeadingLevel(node.tagName);

			node.attribs.className = node.attribs.class;
			delete node.attribs.class;

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
						<ListItem key={index}>{child.props.children}</ListItem>
					))}
			</List>
		),
	},
	{
		shouldProcessNode: (node, children) => node.tagName === 'i' && node.attribs?.classname?.includes('fa-'),
		processNode: (node, children) => (
			<span className="contents" dangerouslySetInnerHTML={{ __html: `<i class="${node.attribs?.classname}"></i>` }} />
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
	const ref = useRef(null);

	const parsed = useMemo(() => {
		return parser.parseWithInstructions(
			html,
			() => true,
			Array.isArray(instructions) ? instructions : DEFAULT_INSTRUCTIONS,
		);
	}, [html, instructions]);

	useEffect(() => {
		dom.i2svg({ node: ref.current });
	}, [parsed]);

	return (
		<div ref={ref} className="contents">
			{parsed}
		</div>
	);
};
