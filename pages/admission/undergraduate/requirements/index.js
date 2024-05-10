import { Layout } from '@/components/layout';
import { Heading } from '@/components/heading';
import { Container } from '@/components/container';
import { readYamlFile } from '@/lib/file-utils';
import { join } from 'path';
import { hierarchy } from '@/lib/admission-requirements';
import { useEffect, useRef, useState } from 'react';
import { Select } from '@/components/select';
import { Button } from '@/components/button';

export async function getStaticProps(context) {
	const path = join(process.cwd(), 'data/admission/undergraduate/requirements');

	const props = {};

	for (let i = hierarchy.length - 1; i >= 0; i--) {
		const attribute = hierarchy[i];
		props[attribute] = await readYamlFile(join(path, `${attribute}.yml`));
	}

	return { props: props };
}

export default function AdmissionRequirementsHome(props) {
	const [values, setValues] = useState({});
	const reversed = [...hierarchy].reverse();
	const slug = reversed.reduce(
		(acc, value) => (!values[value] || acc === null ? null : `${acc}/${values[value]}`),
		'',
	);

	return (
		<Layout>
			<Container centered>
				<Heading level={1}>Undergraduate Admission Requirements</Heading>

				<div className="flex md:w-2/3 flex-col gap-4">
					{Object.getOwnPropertyNames(props)?.map((key) => (
						<Select
							key={key}
							name={key}
							onChange={(option) => setValues((prev) => ({ ...prev, [key]: option?.value }))}
							label={props[key]?.prompt}
							options={props[key]?.values?.map(({ id, name }) => ({
								value: id,
								label: name,
							}))}
						/>
					))}

					<Button color="red">View Requirements</Button>
				</div>
			</Container>
		</Layout>
	);
}
