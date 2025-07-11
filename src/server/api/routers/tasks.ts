import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";
export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is missing in session.",
        });
      }

      await ctx.db.insert(tasks).values({
        userId,
        title: input.title,
        description: input.description,
        isDone: 0,
      });

      return { success: true };
    }),

  taskslist: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User ID is missing in session.",
      });
    }

    const userTasks = await ctx.db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, userId),
      orderBy: (tasks, { asc }) => asc(tasks.createdAt),
    });

    return userTasks ?? [];
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("input : ", input);
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tâche introuvable.",
        });
      }

      if (task.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous ne pouvez pas supprimer cette tâche.",
        });
      }

      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
      return { success: true };
    }),

  check: protectedProcedure
    .input(z.object({ id: z.string(), isDone: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tâche introuvable.",
        });
      }

      if (task.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous ne pouvez pas modifier cette tâche.",
        });
      }

      await ctx.db
        .update(tasks)
        .set({ isDone: input.isDone })
        .where(eq(tasks.id, input.id));

      return { success: true };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tâche introuvable.",
        });
      }

      if (task.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous ne pouvez pas modifier cette tâche.",
        });
      }

      const updateData: Partial<{ title: string; description: string }> = {};

      if (input.title !== undefined) updateData.title = input.title;
      if (input.description !== undefined)
        updateData.description = input.description;

      if (Object.keys(updateData).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Aucune donnée à mettre à jour.",
        });
      }

      await ctx.db.update(tasks).set(updateData).where(eq(tasks.id, input.id));

      return { success: true };
    }),
});
