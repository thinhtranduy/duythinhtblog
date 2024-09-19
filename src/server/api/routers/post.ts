import { z } from "zod";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";



const s3 = new S3Client({
  region:process.env.BUCKET_REGION!,
  credentials:{
      accessKeyId: process.env.ACCESS_KEY!,
      secretAccessKey:process.env.SECRET_ACCESS_KEY!,
  },
})
export async function putFileToS3(file: File ,filename: string): Promise<string>{
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: filename,
      
  });
  try {
    await s3.send(command);
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('File upload failed');
  }
}
export const postRouter = createTRPCRouter({

  create: protectedProcedure
  .input(z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    coverImageBase64: z.string().optional(), // Cover image file buffer
    coverImageName: z.string().optional(), // Cover image file name
    coverImageType: z.string().optional(), // Cover image file type
  }))
  .mutation(async ({ ctx, input }) => {
    const { title, content, coverImageBase64, coverImageName, coverImageType } = input;

    // Handle file upload if provided
    let coverImageUrl: string | null = null;

      if (coverImageBase64 && coverImageName && coverImageType) {
        const coverImageBuffer = Buffer.from(coverImageBase64, 'base64'); // Decode base64 to buffer
        const uploadParams = {
          Bucket:process.env.BUCKET_NAME,
          Key: `uploads/${coverImageName}`,
          Body: coverImageBuffer,
          ContentType: coverImageType,
        };
        try {
          const command = new PutObjectCommand(uploadParams);
          await s3.send(command);

          // Construct the file URL
          coverImageUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
        } catch (error) {
          console.error('Cover image upload failed:', error);
          throw new Error('Cover image upload failed');
        }
      }
    return ctx.db.post.create({
      data: {
        title: input.title,
        content: input.content,
        image: coverImageUrl ?? null,
        createdBy: { connect: { id: ctx.session.user.id } },
      },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    return post;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getTenLatest: protectedProcedure.query(async({ctx})=>{
    const posts = await ctx.db.post.findMany({
        orderBy: {createdAt : "desc"},
        // where: { createdBy: { id: ctx.session.user.id } },
        take: 10
    });
    return posts;
  }),

  getByID : protectedProcedure
    .input(z.object({ id: z.number()}))
    .query(async({ctx, input}) =>{
      const {id} = input;
      const post = await ctx.db.post.findUnique({
        where : {id},
      });
      return post;
  }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input;
      const post = await ctx.db.post.findUnique({ where: { id: postId } });
      
      if (!post) throw new Error('Post not found');
      if (post.createdById !== ctx.session.user.id) throw new Error('Not authorized');

      await ctx.db.post.delete({ where: { id: postId } });
      return { success: true };
    }),

});
