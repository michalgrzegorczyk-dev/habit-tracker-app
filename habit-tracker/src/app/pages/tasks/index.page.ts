import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HabitTaskService} from "../../habit-task.service";

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <main class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          <span class="text-[#DD0031]">Task</span> Manager
        </h1>
        <p class="max-w-2xl mx-auto text-zinc-600 text-lg">
          Manage tasks that are included in habits.
        </p>
      </header>

      <section class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <form (ngSubmit)="addTask()" class="space-y-4">
          <div>
            <input
              required
              autocomplete="off"
              name="taskDescription"
              [(ngModel)]="taskDescription"
              placeholder="Enter task description"
              class="w-full px-4 py-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:border-transparent transition"
            />
          </div>
          <div>
            <select
              required
              name="taskCategory"
              [(ngModel)]="taskCategory"
              class="w-full px-4 py-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:border-transparent transition"
            >
              <option value="" disabled selected>Select a category</option>
              <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
            </select>
          </div>
          <button
            type="submit"
            [disabled]="!taskDescription || !taskCategory"
            class="w-full px-4 py-2 bg-[#DD0031] text-white rounded-md hover:bg-[#BB0029] transition-colors focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:ring-offset-2 disabled:bg-zinc-300 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </form>
      </section>

      <section class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8" *ngIf="tasks.length > 0">
        <h2 class="text-2xl font-semibold mb-4">Tasks</h2>
        <ul class="space-y-2">
          <li *ngFor="let task of tasks" class="flex items-center justify-between bg-zinc-50 p-2 rounded">
            <div class="flex items-center">
              <input
                type="checkbox"
                [id]="'task-' + task.id"
                [(ngModel)]="task.completed"
                class="mr-3 form-checkbox h-5 w-5 text-[#DD0031] rounded focus:ring-[#DD0031]"
              />
              <div>
                <label [for]="'task-' + task.id" [class.line-through]="task.completed">
                  {{ task.description }}
                </label>
                <span class="ml-2 text-sm text-zinc-500">[{{ task.category }}]</span>
              </div>
            </div>
            <button (click)="removeTask(task.id)" class="text-red-500 hover:text-red-700">
              Remove
            </button>
          </li>
        </ul>
      </section>
    </main>
  `,
})
export default class TasksComponent implements OnInit {
  public taskDescription = '';
  public taskCategory = '';
  public tasks: Task[] = [];

  public categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education'];

  constructor(private habitTaskService: HabitTaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasks = this.habitTaskService.getTasks();
  }

  addTask() {
    if (this.taskDescription.trim() && this.taskCategory) {
      this.habitTaskService.addTask({
        description: this.taskDescription.trim(),
        completed: false,
        category: this.taskCategory
      });
      this.taskDescription = '';
      this.taskCategory = '';
      this.loadTasks();
    }
  }

  removeTask(id: number) {
    this.habitTaskService.removeTask(id);
    this.loadTasks();
  }
}
