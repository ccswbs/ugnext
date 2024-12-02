// pages/api/resource.js
export default async function handler(req, res) {
  const { action, resources, id } = req.query;

  if (action === 'read') {
    // Perform your data fetching here
    const response = await fetch(`https://uoguelph-dev.uniweb.io/resource.php?action=read&resources[]=${resources.join('&resources[]=')}&id=${id}`, {
      headers: {
        'clientName': process.env.UNIWEB_CLIENT_NAME,
        'clientSecret': process.env.UNIWEB_CLIENT_SECRET
      }
    });

    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
}