import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { injectTrpcClient } from "../../trpc-client";
import { Subject, switchMap, shareReplay, take } from "rxjs";
import { waitFor } from "@analogjs/trpc";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface Habit {
  id: number;
  name: string;
  createdAt: Date;
  lastCompleted: Date | null;
  tasks: Task[];
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [AsyncPipe, FormsModule, NgFor, DatePipe, NgIf],
  host: {
    class: 'flex min-h-screen flex-col text-zinc-900 bg-zinc-50 px-4 pt-8 pb-8',
  },
  template: `
    <main class="flex-1 container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          <span class="text-[#DD0031]">Habit</span> Tracker
        </h1>
        <p class="max-w-2xl mx-auto text-zinc-600 text-lg">
          Build better routines, one habit at a time.
        </p>
      </header>

      <section class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-[#DD0031]">Add New Habit</h2>
        <form #f="ngForm" (ngSubmit)="addHabit(f)" class="space-y-4">
          <div>
            <input
              required
              autocomplete="off"
              name="newHabit"
              [(ngModel)]="newHabit"
              placeholder="Enter a new habit"
              class="w-full px-4 py-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-[#DD0031] text-white rounded-md hover:bg-[#BB0029] transition-colors focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:ring-offset-2"
          >
            Add Habit
          </button>
        </form>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="habits$ | async as habits">
        <div
          class="habit bg-white rounded-lg shadow-md overflow-hidden"
          *ngFor="let habit of habits; let i = index"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-semibold">{{ habit.name }}</h3>
              <button
                [attr.data-testid]="'removeHabitBtn' + i"
                class="text-zinc-400 hover:text-[#DD0031] transition-colors"
                (click)="removeHabit(habit.id)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-zinc-500 mb-4">Created: {{ habit.createdAt | date:'mediumDate' }}</p>
            <div class="space-y-2 mb-4">
              <div *ngFor="let task of habit.tasks" class="flex items-center bg-zinc-50 rounded p-2">
                <input
                  type="checkbox"
                  [id]="'task-' + task.id"
                  [checked]="task.completed"
                  (change)="toggleTask(habit.id, task.id)"
                  class="mr-3 form-checkbox h-5 w-5 text-[#DD0031] rounded focus:ring-[#DD0031]"
                />
                <label [for]="'task-' + task.id" class="text-sm flex-grow" [class.line-through]="task.completed">
                  {{ task.description }}
                </label>
              </div>
            </div>
            <form (ngSubmit)="addTask(habit.id, newTaskInput.value); newTaskInput.value = ''" class="flex mb-4">
              <input
                #newTaskInput
                type="text"
                placeholder="Add a new task"
                class="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#DD0031]"
              />
              <button
                type="submit"
                class="px-4 py-2 bg-[#DD0031] text-white rounded-r-md hover:bg-[#BB0029] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
          <button
            class="w-full px-4 py-3 bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:ring-offset-2"
            (click)="completeHabit(habit.id)"
          >
            {{ habit.lastCompleted ? 'Completed: ' + (habit.lastCompleted | date:'shortDate') : 'Mark as Completed' }}
          </button>
        </div>

        <div class="text-center p-8 bg-white rounded-lg shadow-md" *ngIf="habits.length === 0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 class="text-xl font-medium mb-2">No habits yet!</h3>
          <p class="text-zinc-500">
            Start by adding a new habit above.
          </p>
        </div>
      </section>
    </main>
  `,
})
export class HabitsComponent {
  private _trpc = injectTrpcClient();
  public triggerRefresh$ = new Subject<void>();
  public habits$ = this.triggerRefresh$.pipe(
    switchMap(() => this._trpc.habit.list.query()),
    shareReplay(1)
  );
  public newHabit = '';

  constructor() {
    void waitFor(this.habits$);
    this.triggerRefresh$.next();
  }

  public addHabit(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.habit.create
      .mutate({ name: this.newHabit, tasks: [] })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
    this.newHabit = '';
    form.form.reset();
  }

  public removeHabit(id: number) {
    this._trpc.habit.remove
      .mutate({ id })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }

  public completeHabit(id: number) {
    this._trpc.habit.complete
      .mutate({ id })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }

  public addTask(habitId: number, taskDescription: string) {
    if (!taskDescription.trim()) return;
    this._trpc.habit.addTask
      .mutate({ habitId, taskDescription })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }

  public toggleTask(habitId: number, taskId: number) {
    this._trpc.habit.toggleTask
      .mutate({ habitId, taskId })
      .pipe(take(1))
      .subscribe(() => this.triggerRefresh$.next());
  }
}
