"use server";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUrl(filename: string, contentType: string): Promise<string> {
  console.log("Generating presigned URL for", filename);
  const commandParams = {
    Bucket: process.env.BUCKET_NAME!,
    Key: `uploads/${filename}`,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(commandParams);

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
    console.log("Presigned URL:", url); 
    return url;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error("Failed to generate presigned URL");
  }
}
