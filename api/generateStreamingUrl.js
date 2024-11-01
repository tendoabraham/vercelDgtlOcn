const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://thetribeug.ams3.digitaloceanspaces.com', // Use your region endpoint
  accessKeyId: process.env.SPACES_KEY,
  secretAccessKey: process.env.SPACES_SECRET,
});

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
