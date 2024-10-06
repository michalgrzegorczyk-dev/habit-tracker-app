import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  description: string;
  completed: boolean;
  category: string;
}

export interface PredefinedHabit {
  id: number;
  name: string;
  tasks: Task[];
}

@Injectable({
  providedIn: 'root'
})
export class HabitTaskService {
  private tasks: Task[] = [];
  private predefinedHabits: PredefinedHabit[] = [];
  private nextTaskId = 1;
  private nextHabitId = 1;

  constructor() {}

  // Task methods
  getTasks(): Task[] {
    return this.tasks;
  }

  addTask(task: Omit<Task, 'id'>): void {
    this.tasks.push({ ...task, id: this.nextTaskId++ });
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  // Predefined Habit methods
  getPredefinedHabits(): PredefinedHabit[] {
    return this.predefinedHabits;
  }

  addPredefinedHabit(habit: Omit<PredefinedHabit, 'id'>): void {
    this.predefinedHabits.push({ ...habit, id: this.nextHabitId++ });
  }

  removePredefinedHabit(id: number): void {
    this.predefinedHabits = this.predefinedHabits.filter(habit => habit.id !== id);
  }
}
