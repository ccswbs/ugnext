import { Fragment, useEffect, useMemo, useState } from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import Link from '@/components/link';
import Heading from '@/components/heading';
import List from '@/components/list';

const headingTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

const parser = new Parser();
const definitions = new ProcessNodeDefinitions();
const defaultInstructions = [
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
				{children}
			</List>
		),
	},
	// Fallback
	{
		shouldProcessNode: () => true,
		processNode: definitions.processDefaultNode,
	},
];

const HtmlParser = ({ html, instructions }) => {
	const parsed = useMemo(() => {
		return parser.parseWithInstructions(html, () => true, [
			...(Array.isArray(instructions) ? instructions : []),
			...defaultInstructions,
		]);
	}, [html, instructions]);

	return <>{parsed}</>;
};

export default HtmlParser;
