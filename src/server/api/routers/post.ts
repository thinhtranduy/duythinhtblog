import { z } from "zod";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { generatePresignedUrl } from "~/app/helper";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generatePresignedUrl } from "~/app/helper";



// const s3 = new S3Client({
//   region:process.env.BUCKET_REGION!,
//   credentials:{
//       accessKeyId: process.env.ACCESS_KEY!,
//       secretAccessKey:process.env.SECRET_ACCESS_KEY!,
//   },
// })
// export async function putFileToS3(file: File ,filename: string): Promise<string>{
//   const command = new PutObjectCommand({
//     Bucket: process.env.AWS_S3_BUCKET_NAME!,
//     Key: filename,
      
//   });
//   try {
//     await s3.send(command);
//     return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`;
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw new Error('File upload failed');
//   }
// }
export const postRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { filename, contentType } = input;
      const url = await generatePresignedUrl(filename, contentType);
      return { url };
    }),

  // create: protectedProcedure
  // .input(z.object({
  //   title: z.string().min(1, "Title is required"),
  //   content: z.string().min(1, "Content is required"),
  //   coverImageBase64: z.string().optional(), // Cover image file buffer
  //   coverImageName: z.string().optional(), // Cover image file name
  //   coverImageType: z.string().optional(), // Cover image file type
  //   tags: z.array(z.string()).optional(),
  // }))
  // .mutation(async ({ ctx, input }) => {
  //   const { title, content, coverImageBase64, coverImageName, coverImageType, tags } = input;

  //   // Handle file upload if provided
  //   let coverImageUrl: string | null = null;

  //     if (coverImageBase64 && coverImageName && coverImageType) {
  //       const coverImageBuffer = Buffer.from(coverImageBase64, 'base64'); 
  //       const uploadParams = {
  //         Bucket:process.env.BUCKET_NAME,
  //         Key: `uploads/${coverImageName}`,
  //         Body: coverImageBuffer,
  //         ContentType: coverImageType,
  //       };
      //   try {
      //     const command = new PutObjectCommand(uploadParams);
      //     await s3.send(command);

      //     // Construct the file URL
      //     coverImageUrl = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
      //   } catch (error) {
      //     console.error('Cover image upload failed:', error);
      //     throw new Error('Cover image upload failed');
      //   }
      // }
  //     const post = await ctx.db.post.create({
  //       data: {
  //         title: input.title,
  //         content: input.content,
  //         image: coverImageUrl ?? null,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });

  //     if (tags && tags.length > 0) {
  //       for (const tagName of tags) {
  //         const tag = await ctx.db.tag.upsert({
  //           where: { name: tagName },
  //           update: {},
  //           create: { name: tagName },
  //         })

  //     await ctx.db.postTag.create({
  //       data: {
  //         postId: post.id,
  //         tagId: tag.id,
  //       },
  //     });
  //     }}

  //     return post;
  //   }),
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1, "Title is required"),
      content: z.string().min(1, "Content is required"),
      coverImageUrl: z.string().optional(), 
      tags: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { title, content, coverImageUrl, tags } = input;

      const post = await ctx.db.post.create({
        data: {
          title,
          content,
          image: coverImageUrl ?? null, 
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });

      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          const tag = await ctx.db.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });

          await ctx.db.postTag.create({
            data: {
              postId: post.id,
              tagId: tag.id,
            },
          });
        }
      }

      return post;
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });

    if (!post) {
      return null; 
    }

    return post;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getTenLatest: protectedProcedure.query(async({ctx})=>{
    const posts = await ctx.db.post.findMany({
        orderBy: {createdAt : "desc"},
        take: 10,
        include : {
          postTags : {
            include: {
              tag : true
            }
          }
        }
    });
    return posts;
  }),

  getByID : protectedProcedure
    .input(z.object({ id: z.number()}))
    .query(async({ctx, input}) =>{
      const {id} = input;
      const post = await ctx.db.post.findUnique({
        where : {id},
        include : {
          postTags : {
            include: {
              tag : true
            }
          }
        }
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
    
    getPostsByTag: protectedProcedure
    .input(z.object({ tagId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { tagId } = input;

      const posts = await ctx.db.post.findMany({
        where: {
          postTags: {
            some: {
              tagId,
            },
          },
        },
        include: {
          postTags: {
            include: {
              tag: true,
            },
          },
        },
      });

      return posts;
    }),

    getPostsBySearchTerm: protectedProcedure
    .input(z.object({ searchTerm: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { searchTerm } = input;

      console.log("Searching for term:", searchTerm); 

      const posts = await ctx.db.post.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      });

      console.log("Found posts:", posts);
      return posts;
    }),
});
