const { GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = require("../config/s3");

const BUCKET = process.env.AWS_S3_BUCKET;

async function getFileUrl(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return await getSignedUrl(s3, command, {
    expiresIn: 300, // 5 minutes
  });
}

async function deleteFile(key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  await s3.send(command);
}

module.exports = {
  getFileUrl,
  deleteFile,
};
