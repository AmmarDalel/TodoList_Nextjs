import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {  tasks } from "~/server/db/schema";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string() , description: z.string()} ))
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.session.user)
       const userId = ctx.session.user.id;

    if (!userId) {
      throw new Error("User ID is missing in session.");
    }
      await ctx.db.insert(tasks).values({
        userId:userId,
        title: input.title,
        description : input.description ,
        isDone : 0 ,
      });
    }),

taskslist: protectedProcedure.query(async ({ ctx }) => {
  const userId = ctx.session.user.id;

  if (!userId) {
    throw new Error("User ID is missing in session.");
  }

  const tasks = await ctx.db.query.tasks.findMany({
    where: (tasks, { eq }) => eq(tasks.userId, userId),
    orderBy: (tasks, { asc }) => asc(tasks.createdAt),
  });

  return tasks ?? null;
}),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
    
      await ctx.db.delete(tasks).where(eq(tasks.id, input.id) );

      return { success: true };
    }),

check : protectedProcedure
  .input(
    z.object({
      id: z.string(),
      isDone: z.number(), 
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db
      .update(tasks)
      .set({isDone: input.isDone })
      .where(eq(tasks.id, input.id))

    return { success: true }
  })


 
});






