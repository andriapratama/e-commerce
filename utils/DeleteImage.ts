import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const DeleteImage = async (imagePathname: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket,
    Key: imagePathname,
  });

  await s3.send(deleteCommand);
};
