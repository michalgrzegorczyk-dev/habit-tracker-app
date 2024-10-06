import { router } from '../trpc';
import { noteRouter } from './notes';
import { habitRouter } from './habits';

export const appRouter = router({
  note: noteRouter,
  habit: habitRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
