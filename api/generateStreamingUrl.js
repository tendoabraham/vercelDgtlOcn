import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: 'https://thetribeug.ams3.digitaloceanspaces.com', // Use your region endpoint
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Ensure only POST requests are allowed
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName } = req.body;  // Access fileName directly

  const params = {
    Bucket: 'thetribeug', // Replace with your Space name
    Key: fileName,
    Expires: 5400, // Set expiration in seconds (e.g., 3600 for 1 hour)
  };

  try {
    const url = s3.getSignedUrl('getObject', params);  // Generate the signed URL
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
