import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const tagsRouter = createTRPCRouter({
    createTag: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Tag name cannot be empty"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name } = input;

      // Check if the tag already exists
      const existingTag = await ctx.db.tag.findUnique({
        where: { name },
      });

      if (existingTag) {
        return existingTag;
      }

      // Otherwise, create a new tag
      const newTag = await ctx.db.tag.create({
        data: {
          name,
        },
      });

      return newTag;
    }),


    getTag: protectedProcedure
    .input(
      z.object({
        tagID: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { tagID } = input;

      const tag = await ctx.db.tag.findUnique({
        where: { id: tagID }, // Fetch tag by its ID
      });

      if (!tag) {
        throw new Error("Tag not found");
      }

      return tag;
    }),

    getTagsByIDs : protectedProcedure
    .input(
      z.object({
        tagIds: z.array(z.number()), 
      })
    )
    .query(async ({ input, ctx }) => {
      const { tagIds } = input;
  
      const tags = await ctx.db.tag.findMany({
        where: {
          id: { in: tagIds }, // Fetch tags by their IDs
        },
      });
  
      // if (tags.length === 0) {
      //   throw new Error("No tags found");
      // }
  
      return tags;
    })

})