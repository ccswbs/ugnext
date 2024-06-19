import { DrupalClient } from 'next-drupal';

export const Drupal =
	typeof window !== 'undefined'
		? null
		: new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, {
				auth: {
					clientId: process.env.DRUPAL_CLIENT_ID,
					clientSecret: process.env.DRUPAL_CLIENT_SECRET,
				},
				headers: {
					'Content-Type': 'application/json',
				},
			});

export const graphql = async (query, variables) => {
	if (!Drupal) {
		return null;
	}

	const endpoint = Drupal.buildUrl('/graphql').toString();

	const response = await Drupal.fetch(endpoint, {
		method: 'POST',
		withAuth: true,
		body: JSON.stringify({
			query: query,
			variables: variables,
		}),
	});

	if (!response.ok) {
		const body = await response.text();

		throw new Error(
			`Failed to fetch graphql data from ${endpoint}, Server responded: ${response.status} ${response.statusText}. ${body}`,
		);
	}

	const body = await response.json();

	if (Array.isArray(body.errors) && body.errors.length > 0) {
		throw new Error(
			`Failed to fetch graphql data from ${endpoint}, Server responded: ${body.errors.map((error) => error.message).join(', ')}`,
		);
	}

	return body;
};
