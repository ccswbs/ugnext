import { useMemo } from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import { Link } from '@/components/link';
import { Heading } from '@/components/heading';
import { List, ListItem } from '@/components/list';
import { Divider } from '@/components/divider';
import { getHeadingLevel } from '@/lib/string-utils';
import Image from 'next/image';
import Script from 'next/script';
import PropTypes from 'prop-types';

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
		processNode: (node, children) => {
			node.attribs.className = node.attribs.class;
			delete node.attribs.class;

			return (
				<Link {...node.attribs} href={node.attribs?.href ?? ''}>
					{children}
				</Link>
			);
		},
	},
	// Lists
	{
		shouldProcessNode: (node) => node.tagName === 'ul' || node.tagName === 'ol',
		processNode: (node, children) => {
			node.attribs.className = node.attribs.class;
			delete node.attribs.class;

			return (
				<List {...node.attribs} variant={node.tagName === 'ol' ? 'ordered' : 'unordered'}>
					{children
						.filter((child) => child.type === 'li')
						.map((child, index) => (
							<ListItem key={index}>{child.props.children}</ListItem>
						))}
				</List>
			);
		},
	},
	// Divider
	{
		shouldProcessNode: (node) => node.tagName === 'hr',
		processNode: (node) => <Divider />,
	},
	// Images
	{
		shouldProcessNode: (node) =>
			node.tagName === 'img' && node.attribs.src && node.attribs.width && node.attribs.height,
		processNode: (node) => (
			<Image
				src={node.attribs.src}
				alt={node.attribs.alt ?? null}
				loading="lazy"
				className={node.attribs.class}
				width={node.attribs.width}
				height={node.attribs.height}
			/>
		),
	},
	// Scripts
	{
		shouldProcessNode: (node) => node.tagName === 'script',
		processNode: (node) => <Script src={node.attribs.src} type={node.attribs.type} strategy="lazyOnload" />,
	},
	// Fallback
	{
		shouldProcessNode: () => true,
		processNode: DEFAULT_PROCESSOR,
	},
];

/**
 * Parses an HTML string into React nodes.
 */
export const HtmlParser = ({ html, instructions }) => {
	const parsed = useMemo(() => {
		return parser.parseWithInstructions(
			html,
			() => true,
			Array.isArray(instructions)
				? [
						...instructions,
						{
							shouldProcessNode: () => true,
							processNode: DEFAULT_PROCESSOR,
						},
					]
				: DEFAULT_INSTRUCTIONS,
		);
	}, [html, instructions]);

	return <>{parsed}</>;
};

HtmlParser.propTypes = {
	html: PropTypes.string.isRequired,
	/**
	 * Custom parsing instructions
	 */
	instructions: PropTypes.arrayOf(
		PropTypes.shape({
			shouldProcessNode: PropTypes.func.isRequired,
			processNode: PropTypes.func.isRequired,
		}),
	),
};
