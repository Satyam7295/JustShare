import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

s3.listBuckets((err, data) => {
  if (err) {
    console.log(`S3_ERROR:${err.code || err.message}`);
    process.exit(1);
    return;
  }

  console.log(`S3_OK:${(data?.Buckets || []).length}`);
  process.exit(0);
});
