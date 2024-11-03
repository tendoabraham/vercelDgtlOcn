const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://ams3.digitaloceanspaces.com', // Use your region endpoint
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      // Ensure only POST requests are allowed
      return res.status(405).json({ error: 'Methods Not Allowed' });
    }
}

exports.handler = async function (event, context) {
  const { fileName } = JSON.parse(event.body);  // Only fileName is needed for access

  const params = {
    Bucket: 'thetribeug', // Replace with your Space name
    Key: fileName,
    Expires: 5400, // Set expiration in seconds (e.g., 3600 for 1 hour)
  };

  try {
    const url = s3.getSignedUrl('getObject', params);  // For accessing the object
    return {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify(error) };
  }
};
