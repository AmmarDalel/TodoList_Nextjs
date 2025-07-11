import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string(),
        name: z.string(),
        password: z.string(),
        confirmPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (existingUser) {
        throw new Error("Email déjà utilisé");
      }

      const newUser = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: input.password,
        })
        .returning();

      return newUser[0];
    }),
});
