export default function exit(_request, response) {
	response.clearPreviewData();
	response.writeHead(307, { Location: '/' });
	response.end();
}
