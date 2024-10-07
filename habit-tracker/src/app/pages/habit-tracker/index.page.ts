import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredefinedHabit, PredefinedHabitsService } from '../predefined-habits/predefined-habits.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideChevronLeft } from '@ng-icons/lucide';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

interface Task {
  id: number;
  description: string;
  completed: boolean;
  category: string;
}

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
  imports: [CommonModule, FormsModule, HlmButtonDirective, HlmIconComponent],
  providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
  templateUrl: './habit-tracker.component.html'
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
  private readonly STORAGE_KEY = 'habitsByDay';
  private readonly TASK_COMPLETION_KEY = 'taskCompletionByDay';

  constructor(private habitTaskService: PredefinedHabitsService) {}

  ngOnInit() {
    this.generateCurrentWeek();
    this.loadPredefinedHabits();
    this.loadHabitsForWeek();
    this.loadTaskCompletionStatus();
  }

  addHabitCollection(day: DayData) {
    this.selectedDay = day;
    this.showHabitSelector = true;
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
    this.loadHabitsForWeek();
    this.loadTaskCompletionStatus();
  }

  loadPredefinedHabits() {
    this.habitTaskService.getPredefinedHabits().subscribe(habits => {
      this.predefinedHabits = habits;
    });
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
      this.saveHabitsForDay(this.selectedDay);
    }

    this.closeHabitSelector();
  }

  removeHabit(day: DayData, habit: Habit) {
    const index = day.habits.indexOf(habit);
    if (index > -1) {
      day.habits.splice(index, 1);
      this.saveHabitsForDay(day);
    }
    this.saveTaskCompletionStatus();
  }

  onTaskCompletionChange(day: DayData, habit: Habit, task: Task) {
    this.saveTaskCompletionStatus();
  }

  private saveHabitsForDay(day: DayData) {
    const storageKey = `${this.STORAGE_KEY}_${day.date.toISOString().split('T')[0]}`;
    localStorage.setItem(storageKey, JSON.stringify(day.habits));
  }

  private loadHabitsForWeek() {
    this.currentWeek.forEach(day => {
      const storageKey = `${this.STORAGE_KEY}_${day.date.toISOString().split('T')[0]}`;
      const habitsJson = localStorage.getItem(storageKey);
      day.habits = habitsJson ? JSON.parse(habitsJson) : [];
    });
  }

  private saveTaskCompletionStatus() {
    const completionStatus: { [key: string]: boolean } = {};
    this.currentWeek.forEach(day => {
      day.habits.forEach(habit => {
        habit.tasks.forEach(task => {
          const key = `${day.date.toISOString().split('T')[0]}_${habit.id}_${task.id}`;
          completionStatus[key] = task.completed;
        });
      });
    });
    localStorage.setItem(this.TASK_COMPLETION_KEY, JSON.stringify(completionStatus));
  }

  private loadTaskCompletionStatus() {
    const completionStatusJson = localStorage.getItem(this.TASK_COMPLETION_KEY);
    if (completionStatusJson) {
      const completionStatus = JSON.parse(completionStatusJson);
      this.currentWeek.forEach(day => {
        day.habits.forEach(habit => {
          habit.tasks.forEach(task => {
            const key = `${day.date.toISOString().split('T')[0]}_${habit.id}_${task.id}`;
            if (key in completionStatus) {
              task.completed = completionStatus[key];
            }
          });
        });
      });
    }
  }
}
