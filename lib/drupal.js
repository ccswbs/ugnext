import { DrupalClient } from 'next-drupal';

export const Drupal = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, {
	auth: {
		clientId: process.env.DRUPAL_CLIENT_ID,
		clientSecret: process.env.DRUPAL_CLIENT_SECRET,
	},
	headers: {
		'Content-Type': 'application/json',
	},
});

export const graphql = async (query) => {
	const endpoint = Drupal.buildUrl('/graphql').toString();

	const response = await Drupal.fetch(endpoint, {
		method: 'POST',
		withAuth: true,
		body: JSON.stringify({
			query: query,
		}),
	});

	const body = await response.json();

	if (!response.ok) {
		throw new Error(
			`Failed to fetch graphql data from ${endpoint}, Server responded: ${response.status} ${response.statusText}. ${body?.message ?? ''}`,
		);
	}

	return body;
};