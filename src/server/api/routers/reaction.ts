import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const reactionRouter = createTRPCRouter({
    saveReaction: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        emoji: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { postId, emoji } = input;
      const userId = ctx.session.user.id;

      const existingReaction = await db.reaction.findUnique({
        where: {
          userId_postId_emoji: {
            userId,
            postId,
            emoji,
          },
        },
      });
      if (existingReaction) {
        await db.reaction.update({
          where: {
            id: existingReaction.id,
          },
          data: {
            reacted: !existingReaction.reacted,
          },
        });
    } else {
        await db.reaction.create({
          data: {
            userId,
            postId,
            emoji,
            reacted: true,
          },
        });
      }
      return true;
    }),

    getReactionCounts: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      const { postId } = input;

      const counts = await db.reaction.groupBy({
        by: ['emoji'],
        where: { postId, reacted: true },
        _count: {
          emoji: true,
        },
      });

      return counts.map(count => ({
        emoji: count.emoji,
        count: count._count.emoji,
      }));
    }),


  getReactionCountsForUser: protectedProcedure
  .input(z.object({ postId: z.number(), userId: z.string().optional() }))
  .query(async ({ input }) => {
    const { postId, userId } = input;

    const counts = await db.reaction.groupBy({
      by: ['emoji'],
      where: {
        postId,
        reacted: true,
        ...(userId && { userId }),
      },
      _count: {
        emoji: true,
      },
    });

    return counts.map(count => ({
      emoji: count.emoji,
      count: count._count?.emoji,
    }));
  }),

})