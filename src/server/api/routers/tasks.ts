/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";

/* ************************************************************************** */
/*                                Router Definition                           */
/* ************************************************************************** */
export const taskRouter = createTRPCRouter({
  /* ************************************************************************** */
  /*                                Create Task                               */
  /* ************************************************************************** */
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Vérification de la présence de l'ID utilisateur
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID is missing in session.",
        });
      }

      // Insertion de la nouvelle tâche en base
      await ctx.db.insert(tasks).values({
        userId,
        title: input.title,
        description: input.description,
        isDone: 0,
      });

      return { success: true };
    }),

  /* ************************************************************************** */
  /*                              Get User Tasks                              */
  /* ************************************************************************** */
  taskslist: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Vérification de la session utilisateur
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User ID is missing in session.",
      });
    }

    // Récupération des tâches de l'utilisateur, triées par date de création
    const userTasks = await ctx.db.query.tasks.findMany({
      where: (tasks, { eq }) => eq(tasks.userId, userId),
      orderBy: (tasks, { asc }) => asc(tasks.createdAt),
    });

    return userTasks ?? [];
  }),

  /* ************************************************************************** */
  /*                              Delete a Task                               */
  /* ************************************************************************** */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Recherche de la tâche par ID
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tâche introuvable.",
        });
      }

      // Vérification que l'utilisateur est propriétaire de la tâche
      if (task.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous ne pouvez pas supprimer cette tâche.",
        });
      }

      // Suppression de la tâche
      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
      return { success: true };
    }),

  /* ************************************************************************** */
  /*                              Toggle Task Status                          */
  /* ************************************************************************** */
  check: protectedProcedure
    .input(z.object({ id: z.string(), isDone: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Recherche de la tâche à modifier
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tâche introuvable.",
        });
      }

      // Vérification de la propriété
      if (task.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous ne pouvez pas modifier cette tâche.",
        });
      }

      // Mise à jour du statut de la tâche (faite / non faite)
      await ctx.db
        .update(tasks)
        .set({ isDone: input.isDone })
        .where(eq(tasks.id, input.id));

      return { success: true };
    }),

  /* ************************************************************************** */
  /*                              Update Task Details                         */
  /* ************************************************************************** */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Recherche de la tâche à mettre à jour
      const task = await ctx.db.query.tasks.findFirst({
        where: (t, { eq }) => eq(t.id, input.id),
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tâche introuvable.",
        });
      }

      // Vérification de la propriété
      if (task.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vous ne pouvez pas modifier cette tâche.",
        });
      }

      // Préparation des données à mettre à jour
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

      // Mise à jour en base
      await ctx.db.update(tasks).set(updateData).where(eq(tasks.id, input.id));

      return { success: true };
    }),
});
