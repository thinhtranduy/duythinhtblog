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
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { text, postId } = input;
      const userId = ctx.session.user.id; 

      const newComment = await db.comment.create({
        data: {
          text,
          postId,
          userId,
        },
      });

      return newComment; 
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
        },
        include: {
          user: true,
        },
        orderBy: {
            createdAt: 'desc',
          },
        });
      return comments;
    }),
});