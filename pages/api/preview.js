import { Drupal } from '@/lib/drupal';

export default async function handler(request, response) {
  return await Drupal.preview(request, response);
}
