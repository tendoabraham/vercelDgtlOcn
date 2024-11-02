import AWS from 'aws-sdk';

// Set the region and endpoint correctly
const s3 = new AWS.S3({
  endpoint: 'ams3.digitaloceanspaces.com', // Use just the region endpoint
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  s3ForcePathStyle: true, // Enable path-style URLs
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Ensure only POST requests are allowed
    return res.status(405).json({ error: 'Methods Not Allowed' });
  }

  const { fileName } = req.body;  // Access fileName directly

  const params = {
    Bucket: 'thetribeug', // Replace with your Space name
    Key: fileName,
    Expires: 5400, // Set expiration in seconds (e.g., 3600 for 1 hour)
  };

  try {
    const url = s3.getSignedUrl('getObject', params);  // Generate the signed URL
    const fullUrl = `https://${params.Bucket}.${s3.endpoint}/${params.Key}?AWSAccessKeyId=${process.env.SPACES_KEY}&Expires=${params.Expires}&Signature=${url.split('Signature=')[1]}`; // Create the full URL format
    res.status(200).json({ url: fullUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
