import { Fragment, useEffect, useMemo, useState } from 'react';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import Link from '@/components/link';

const parser = new Parser();
const definitions = new ProcessNodeDefinitions();
const defaultInstructions = [
	{
		shouldProcessNode: (node) => node?.tagName === 'a' && typeof node?.attribs?.href === 'string',
		processNode: (node, children) => (
			<Link {...node.attribs} href={node.attribs?.href ?? ''}>
				{children}
			</Link>
		),
	},
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
}

export default HtmlParser;
