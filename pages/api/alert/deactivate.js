export default async function handler(request, response) {
  console.log('deactivating alert', response.status);

  return response.status(200).json({});
}