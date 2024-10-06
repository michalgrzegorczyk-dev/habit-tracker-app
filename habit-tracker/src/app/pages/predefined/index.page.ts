import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {PredefinedHabit, HabitTaskService} from "../../habit-task.service";

@Component({
  selector: 'app-predefined-habits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          Predefined <span class="text-[#DD0031]">Habits</span>
        </h1>
      </header>

      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Create New Habit Template</h2>
        <div class="bg-white p-4 rounded-lg shadow">
          <input [(ngModel)]="newHabitName" placeholder="Habit name" class="w-full p-2 border rounded mb-4">
          <div class="mb-4">
            <h3 class="text-lg font-semibold mb-2">Select Tasks:</h3>
            <div class="max-h-60 overflow-y-auto">
              <div *ngFor="let task of availableTasks" class="flex items-center mb-2">
                <input type="checkbox" [id]="'task-' + task.id" [(ngModel)]="task.selected" class="mr-2">
                <label [for]="'task-' + task.id">
                  {{ task.description }} [{{ task.category }}]
                </label>
              </div>
            </div>
          </div>
          <button (click)="saveNewHabit()" class="px-4 py-2 bg-[#DD0031] text-white rounded">Save Habit Template</button>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-4">Existing Habit Templates</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let habit of predefinedHabits" class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-2">{{ habit.name }}</h3>
            <ul class="mb-4">
              <li *ngFor="let task of habit.tasks" class="mb-1">
                {{ task.description }} [{{ task.category }}]
              </li>
            </ul>
            <button (click)="deletePredefinedHabit(habit.id)" class="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
          </div>
        </div>
      </div>
    </main>
  `
})
export default class PredefinedHabitsComponent implements OnInit {
  predefinedHabits: PredefinedHabit[] = [];
  newHabitName: string = '';
  availableTasks: (Task & { selected: boolean })[] = [];

  constructor(private habitTaskService: HabitTaskService) {}

  ngOnInit() {
    this.loadPredefinedHabits();
    this.loadAvailableTasks();
  }

  loadPredefinedHabits() {
    this.predefinedHabits = this.habitTaskService.getPredefinedHabits();
  }

  loadAvailableTasks() {
    this.availableTasks = this.habitTaskService.getTasks().map(task => ({ ...task, selected: false }));
  }

  saveNewHabit() {
    if (this.newHabitName.trim() && this.availableTasks.some(t => t.selected)) {
      const newHabit: Omit<PredefinedHabit, 'id'> = {
        name: this.newHabitName.trim(),
        tasks: this.availableTasks.filter(t => t.selected).map(({ selected, ...task }) => task)
      };
      this.habitTaskService.addPredefinedHabit(newHabit);
      this.newHabitName = '';
      this.availableTasks.forEach(t => t.selected = false);
      this.loadPredefinedHabits();
    }
  }

  deletePredefinedHabit(id: number) {
    this.habitTaskService.removePredefinedHabit(id);
    this.loadPredefinedHabits();
  }
}
