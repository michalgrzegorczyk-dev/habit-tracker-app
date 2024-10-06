import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredefinedHabit, HabitTaskService } from '../../habit-task.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

interface Habit {
  id: number;
  name: string;
  tasks: Task[];
}

interface DayData {
  date: Date;
  habits: Habit[];
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmButtonDirective],
  template: `
    <main class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          <span class="text-[#DD0031]">Habit</span> Tracker
        </h1>
      </header>

      <div class="mb-4 flex justify-between items-center">
        <button (click)="changeWeek(-1)" hlmBtn>Previous Week</button>
        <h2 class="text-2xl font-bold">{{ weekStartDate | date:'MMM d' }} - {{ weekEndDate | date:'MMM d, yyyy' }}</h2>
        <button (click)="changeWeek(1)" hlmBtn>Next Week</button>
      </div>

      <div *ngFor="let day of currentWeek; let i = index" class="mb-8 border rounded-lg p-4 bg-white">
        <h3 class="text-xl font-bold mb-4">{{ weekDays[i] }} - {{ day.date | date:'MMM d' }}</h3>

        <div class="flex flex-wrap gap-4">
          <div *ngFor="let habit of day.habits" class="w-64 p-4 border rounded-lg bg-white shadow">
            <h4 class="font-bold mb-2">{{ habit.name }}</h4>
            <div class="mb-4 max-h-40 overflow-y-auto">
              <div *ngFor="let task of habit.tasks" class="flex items-center mb-2">
                <input type="checkbox" [(ngModel)]="task.completed" class="mr-2">
                <span class="text-sm">{{ task.description }}</span>
              </div>
            </div>
            <div class="flex justify-end">
              <button (click)="removeHabit(day, habit)" class="px-4 py-2 bg-zinc-200 rounded-md text-sm">Remove</button>
            </div>
          </div>

          <!-- Add Habit Card -->
          <div (click)="openHabitSelector(day)"
               class="w-64 h-64 flex flex-col items-center justify-center border rounded-lg bg-zinc-100 cursor-pointer hover:bg-zinc-200 transition-colors shadow">
            <div class="text-4xl text-zinc-500 mb-2">+</div>
            <p class="text-zinc-600 font-semibold">Add New Habit</p>
          </div>
        </div>
      </div>

      <!-- Habit Selector Modal -->
      <div *ngIf="showHabitSelector" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg w-96">
          <h3 class="text-xl font-bold mb-4">Select a Habit</h3>
          <div class="mb-4 max-h-60 overflow-y-auto">
            <div *ngFor="let habit of predefinedHabits"
                 (click)="selectHabit(habit)"
                 class="p-2 border rounded mb-2 cursor-pointer hover:bg-zinc-100">
              {{ habit.name }}
            </div>
          </div>
          <button (click)="closeHabitSelector()" class="w-full px-4 py-2 bg-zinc-200 rounded">Cancel</button>
        </div>
      </div>
    </main>
  `,
})
export default class HabitTrackerComponent implements OnInit {
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  currentWeek: DayData[] = [];
  weekStartDate: Date = new Date();
  weekEndDate: Date = new Date();
  predefinedHabits: PredefinedHabit[] = [];
  showHabitSelector = false;
  selectedDay: DayData | null = null;
  private nextHabitId = 1;

  constructor(private habitTaskService: HabitTaskService) {}

  ngOnInit() {
    this.generateCurrentWeek();
    this.loadPredefinedHabits();
  }

  generateCurrentWeek() {
    this.currentWeek = [];
    const currentDate = new Date(this.weekStartDate);
    currentDate.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday

    for (let i = 0; i < 7; i++) {
      this.currentWeek.push(this.createDayData(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.weekStartDate = new Date(this.currentWeek[0].date);
    this.weekEndDate = new Date(this.currentWeek[6].date);
  }

  createDayData(date: Date): DayData {
    return {
      date: date,
      habits: []
    };
  }

  changeWeek(delta: number) {
    this.weekStartDate.setDate(this.weekStartDate.getDate() + 7 * delta);
    this.generateCurrentWeek();
  }

  loadPredefinedHabits() {
    this.predefinedHabits = this.habitTaskService.getPredefinedHabits();
  }

  openHabitSelector(day: DayData) {
    this.selectedDay = day;
    this.showHabitSelector = true;
  }

  closeHabitSelector() {
    this.showHabitSelector = false;
    this.selectedDay = null;
  }

  selectHabit(predefinedHabit: PredefinedHabit) {
    if (this.selectedDay) {
      const newHabit: Habit = {
        id: this.nextHabitId++,
        name: predefinedHabit.name,
        tasks: predefinedHabit.tasks.map(task => ({ ...task, completed: false }))
      };
      this.selectedDay.habits.push(newHabit);
      this.closeHabitSelector();
    }
  }

  removeHabit(day: DayData, habit: Habit) {
    const index = day.habits.indexOf(habit);
    if (index > -1) {
      day.habits.splice(index, 1);
    }
  }
}
