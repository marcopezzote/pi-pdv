require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");

const bucketName = process.env.SUPABASE_BUCKET;

const client = new S3Client({
  forcePathStyle: true,
  region: process.env.SUPABASE_REGION,
  endpoint: process.env.SUPABASE_URL,
  credentials: {
    accessKeyId: process.env.SUPABASE_KEY,
    secretAccessKey: process.env.SUPABASE_SECRET_KEY,
  },
});

module.exports = { client, bucketName };
