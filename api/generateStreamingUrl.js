import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: 'thetribeug.ams3.digitaloceanspaces.com', // Remove 'https://' to avoid duplication in the URL
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  s3ForcePathStyle: true, // Ensures that the bucket is treated as part of the URL path
  signatureVersion: 'v4',  // Ensures compatibility with AWS signature for DigitalOcean
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName } = req.body;

  const params = {
    Bucket: 'thetribeug', // Your Space name
    Key: fileName,
    Expires: 5400, // Set expiration time (in seconds)
  };

  try {
    const url = s3.getSignedUrl('getObject', params); // Generate the signed URL
    res.status(200).json({ url });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
