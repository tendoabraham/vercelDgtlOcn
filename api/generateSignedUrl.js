const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://ams3.digitaloceanspaces.com', // DigitalOcean Spaces endpoint
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (for testing)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS'); // Allow POST and preflight OPTIONS
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(200).end();
  }
  
  if (req.method === 'POST') {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: 'thetribeug',
      Key: fileName,
      Expires: 3600, // Link valid for 60 seconds
      ContentType: fileType,
      ACL: 'private',  
    };

    try {
      const url = s3.getSignedUrl('putObject', params);
      res.status(200).json({ url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}