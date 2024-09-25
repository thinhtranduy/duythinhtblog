import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
const updateUserSchema = z.object({
  id: z.string(), 
  userName: z.string().optional(),
  website : z.string().optional(),
  location : z.string().optional(),
  bio: z.string().optional(),
  currentlyLearning: z.string().optional(),
  availableFor: z.string().optional(),
  skills: z.string().optional(),
  currentlyHacking: z.string().optional(),
  pronouns: z.string().optional(),
  work: z.string().optional(),
  education: z.string().optional(),
  brandColor: z.string().default("#000000"), 
  profileImage : z.string().optional()
});

export const userRouter = createTRPCRouter({
    getUserById: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input },
        include: {
          posts: {
            orderBy: {
              createdAt: 'desc'
            }
          },
          comments: true
        }, 
      });
  
      if (!user) {
        throw new Error('User not found');
      }
  
      return user;
    }),

    updateUser: protectedProcedure
  .input(updateUserSchema)
  .mutation(async ({ ctx, input }) => {
    const updatedUser = await ctx.db.user.update({
      where: { id: input.id },
      data: {
        userName: input.userName,
        website: input.website,
        location: input.location,
        bio: input.bio,
        currentlyLearning: input.currentlyLearning,
        availableFor: input.availableFor,
        skills: input.skills,
        currentlyHacking: input.currentlyHacking,
        pronouns: input.pronouns,
        work: input.work,
        education: input.education,
        brandColor: input.brandColor,
        image: input.profileImage, 
      },
    });
    return updatedUser; 
  }),
  });