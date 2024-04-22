import Layout from '@/components/layout';

export default function ServerError() {
	return (
		<Layout title="500: Internal Server Error">
			<div className="container-center">
				<h1 className="text-red">HTTP 500 — Internal Server Error</h1>
			</div>
		</Layout>
	);
}
