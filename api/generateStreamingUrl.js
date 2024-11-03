const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://ams3.digitaloceanspaces.com',
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
  signatureVersion: 'v2'
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName } = req.body;

  const params = {
    Bucket: 'thetribeug',
    Key: fileName,
    Expires: 5400,
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Error generating signed URL', details: error.message });
  }
}
