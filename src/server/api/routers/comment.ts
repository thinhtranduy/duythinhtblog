import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";


export const commentRouter = createTRPCRouter({
  submitComment: protectedProcedure
  .input(
    z.object({
      text: z.string().min(1, "Comment cannot be empty"),
      postId: z.number().int(),
      parentId: z.number().int().optional(), 
    })
  )
  .mutation(async ({ input, ctx }) => {
    const { text, postId, parentId } = input; 
    const userId = ctx.session.user.id; 

    try {
      const newComment = await db.comment.create({
        data: {
          text,
          postId,
          userId,
          parentId: parentId ?? null,
        },
      });

      return newComment; 
    } catch (error) {
      throw new Error("Failed to submit comment: ");
    }
  }),

   
    getComments: protectedProcedure
  .input(
    z.object({
      postId: z.number().int(),
    })
  )
  .query(async ({ input }) => {
    const { postId } = input;

    const comments = await db.comment.findMany({
      where: {
        postId,
        parentId: null, 
      },
      include: {
        user: true,
        replies: { // Include replies for each comment
          include: {
            user: true, 
            
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return comments;
  }),
});