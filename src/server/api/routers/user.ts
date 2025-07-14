/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

/* ************************************************************************** */
/*                                Router Definition                           */
/* ************************************************************************** */
export const userRouter = createTRPCRouter({
  /* ************************************************************************** */
  /*                             User Registration                            */
  /* ************************************************************************** */
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
      // Vérification si l'email est déjà utilisé
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, input.email),
      });

      if (existingUser) {
        throw new Error("Email déjà utilisé");
      }

      // Insertion du nouvel utilisateur en base
      const newUser = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          password: input.password,
        })
        .returning();

      // Retourne le premier utilisateur créé (normalement un seul)
      return newUser[0];
    }),
});
