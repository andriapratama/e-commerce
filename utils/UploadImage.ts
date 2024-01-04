import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export const UploadImage = async (image: File) => {
  const imageName = `${Date.now()}-${image.name}`;

  const Body = (await image.arrayBuffer()) as Buffer;

  const params = {
    Bucket,
    Key: `${imageName}`,
    Body,
    ContentType: "image/jpg",
  };

  const putCommand = new PutObjectCommand(params);

  await s3.send(putCommand);

  const getCommand = new GetObjectCommand({ Bucket, Key: imageName });

  const imageLink: string = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${getCommand.input.Key}`;

  const imagePathname: string | undefined = getCommand.input.Key;

  return { imageLink, imagePathname };
};
