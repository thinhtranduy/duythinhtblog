// import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const s3 = new S3Client({
//     region:process.env.BUCKET_REGION!,
//     credentials:{
//         accessKeyId: process.env.ACCESS_KEY!,
//         secretAccessKey:process.env.SECRET_ACCESS_KEY!,
//     },
//   })
//   export async function putFileToS3(file: File ,filename: string): Promise<string>{
//     const command = new PutObjectCommand({
//       Bucket: process.env.AWS_S3_BUCKET_NAME!,
//       Key: filename,
        
//     });
//     try {
//       await s3.send(command);
//       return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
//     } catch (error) {
//       console.error('Error uploading file to S3:', error);
//       throw new Error('File upload failed');
//     }
//   }