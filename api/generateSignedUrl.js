const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://thetribeug.ams3.digitaloceanspaces.com', // DigitalOcean Spaces endpoint
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { fileName, fileType } = req.body;

    const params = {
      Bucket: 'thetribeug',
      Key: fileName,
      Expires: 60, // Link valid for 60 seconds
      ContentType: fileType,
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