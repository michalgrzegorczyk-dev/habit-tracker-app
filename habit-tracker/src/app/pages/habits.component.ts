import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  description: string;
  selected: boolean;
}

interface Habit {
  id: number;
  name: string;
  tasks: Task[];
  isEditing: boolean;
}

interface DayData {
  date: Date;
  habits: Habit[];
}

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          <span class="text-[#DD0031]">Habit</span> Tracker
        </h1>
      </header>

      <div class="mb-4 flex justify-between items-center">
        <button (click)="changeWeek(-1)" class="px-4 py-2 bg-zinc-200 rounded-md">&lt; Previous Week</button>
        <h2 class="text-2xl font-bold">{{ weekStartDate | date:'MMM d' }} - {{ weekEndDate | date:'MMM d, yyyy' }}</h2>
        <button (click)="changeWeek(1)" class="px-4 py-2 bg-zinc-200 rounded-md">Next Week &gt;</button>
      </div>

      <div *ngFor="let day of currentWeek; let i = index" class="mb-8 border rounded-lg p-4 bg-white">
        <h3 class="text-xl font-bold mb-4">{{ weekDays[i] }} - {{ day.date | date:'MMM d' }}</h3>

        <div class="flex flex-wrap gap-4">
          <div *ngFor="let habit of day.habits" class="w-64 p-4 border rounded-lg bg-white shadow">
            <input [(ngModel)]="habit.name"
                   placeholder="Habit name"
                   class="w-full p-2 border rounded mb-4 text-sm">
            <div class="mb-4 max-h-40 overflow-y-auto">
              <div *ngFor="let task of habit.tasks" class="flex items-center mb-2">
                <input type="checkbox" [(ngModel)]="task.selected" class="mr-2">
                <span class="text-sm">{{ task.description }}</span>
              </div>
            </div>
            <div class="flex justify-end">
              <button (click)="removeHabit(day, habit)" class="px-4 py-2 bg-zinc-200 rounded-md text-sm">Remove</button>
            </div>
          </div>

          <!-- Add Habit Card -->
          <div (click)="addNewHabit(day)"
               class="w-64 h-64 flex flex-col items-center justify-center border rounded-lg bg-zinc-100 cursor-pointer hover:bg-zinc-200 transition-colors shadow">
            <div class="text-4xl text-zinc-500 mb-2">+</div>
            <p class="text-zinc-600 font-semibold">Add New Habit</p>
          </div>
        </div>
      </div>
    </main>
  `,
})
export class HabitsComponent implements OnInit {
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  currentWeek: DayData[] = [];
  weekStartDate: Date = new Date();
  weekEndDate: Date = new Date();
  private nextHabitId = 1;
  private nextTaskId = 1;
  availableTasks: Task[] = [
    { id: 1, description: 'Drink water', selected: false },
    { id: 2, description: 'Exercise', selected: false },
    { id: 3, description: 'Read a book', selected: false },
    { id: 4, description: 'Meditate', selected: false },
    { id: 5, description: 'Write in journal', selected: false },
  ];

  ngOnInit() {
    this.generateCurrentWeek();
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

  addNewHabit(day: DayData) {
    const newHabit: Habit = {
      id: this.nextHabitId++,
      name: '',
      tasks: this.availableTasks.map(task => ({ ...task, id: this.nextTaskId++ })),
      isEditing: true
    };
    day.habits.push(newHabit);
  }

  removeHabit(day: DayData, habit: Habit) {
    const index = day.habits.indexOf(habit);
    if (index > -1) {
      day.habits.splice(index, 1);
    }
  }
}
