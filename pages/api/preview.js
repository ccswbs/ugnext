import { Drupal } from "@/lib/drupal";

export default async function handler(request, response) {
  // If the request has our secret key, enable preview mode, typically this will not be from Drupal,
  // because Drupal will send an encrypted token, but we can use this for testing.
  if (request.query.secret === process.env.DRUPAL_PREVIEW_SECRET) {
    response.setPreviewData({});
    response.writeHead(302, { Location: '/' });
    response.end('Preview mode enabled');
    return;
  }

  return await Drupal.preview(request, response);
}
