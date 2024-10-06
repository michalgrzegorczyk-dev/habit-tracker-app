import { z } from 'zod';
import { publicProcedure, router } from '../trpc';

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface Habit {
  id: number;
  name: string;
  createdAt: string;
  lastCompleted: string | null;
  tasks: Task[];
}

let habitId = 0;
let taskId = 0;
const habits: Habit[] = [];

export const habitRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        tasks: z.array(z.string()).optional(),
      })
    )
    .mutation(({ input }) =>
      habits.push({
        id: habitId++,
        name: input.name,
        createdAt: new Date().toISOString(),
        lastCompleted: null,
        tasks: (input.tasks || []).map(description => ({
          id: taskId++,
          description,
          completed: false,
        })),
      })
    ),

  list: publicProcedure.query(() => habits),

  remove: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input }) => {
      const index = habits.findIndex((habit) => input.id === habit.id);
      if (index !== -1) {
        habits.splice(index, 1);
      }
    }),

  complete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input }) => {
      const habit = habits.find((h) => h.id === input.id);
      if (habit) {
        habit.lastCompleted = new Date().toISOString();
      }
    }),

  addTask: publicProcedure
    .input(
      z.object({
        habitId: z.number(),
        taskDescription: z.string(),
      })
    )
    .mutation(({ input }) => {
      const habit = habits.find(h => h.id === input.habitId);
      if (habit) {
        habit.tasks.push({
          id: taskId++,
          description: input.taskDescription,
          completed: false,
        });
      }
    }),

  toggleTask: publicProcedure
    .input(
      z.object({
        habitId: z.number(),
        taskId: z.number(),
      })
    )
    .mutation(({ input }) => {
      const habit = habits.find(h => h.id === input.habitId);
      if (habit) {
        const task = habit.tasks.find(t => t.id === input.taskId);
        if (task) {
          task.completed = !task.completed;
        }
      }
    }),

  removeTask: publicProcedure
    .input(
      z.object({
        habitId: z.number(),
        taskId: z.number(),
      })
    )
    .mutation(({ input }) => {
      const habit = habits.find(h => h.id === input.habitId);
      if (habit) {
        const taskIndex = habit.tasks.findIndex(t => t.id === input.taskId);
        if (taskIndex !== -1) {
          habit.tasks.splice(taskIndex, 1);
        }
      }
    }),
});
