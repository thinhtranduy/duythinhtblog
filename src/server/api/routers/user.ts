import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getUserById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input },
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return user;
    }),
  });