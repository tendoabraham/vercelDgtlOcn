import AWS from 'aws-sdk';

// Configure the S3 client to use DigitalOcean Spaces
const spacesEndpoint = new aws.Endpoint('ams3.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.SPACES_KEY,         // Use environment variables for security
  secretAccessKey: process.env.SPACES_SECRET,  // Use environment variables for security
});

// Handler function for generating a signed URL
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Only allow POST requests
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName } = req.body;  // Assuming `fileName` is sent in the POST request body

  if (!fileName) {
    return res.status(400).json({ error: 'File name is required' });
  }

  const params = {
    Bucket: 'thetribeug',  // Replace with your actual bucket name
    Key: fileName,          // Use the file name provided in the request
    Expires: 5400           // URL expiration time in seconds (e.g., 1.5 hours)
  };

  try {
    const url = s3.getSignedUrl('getObject', params);  // Generate the signed URL
    res.status(200).json({ url });  // Return the signed URL in the response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating signed URL' });
  }
}