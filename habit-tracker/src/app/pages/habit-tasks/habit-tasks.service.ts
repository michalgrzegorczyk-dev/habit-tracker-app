import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  description: string;
  completed: boolean;
  category: string;
}

export interface PredefinedHabit {
  name: string;
  tasks: Task[];
}

export interface HabitTaskState {
  tasks: Task[];
  predefinedHabits: PredefinedHabit[];
}

@Injectable({
  providedIn: 'root'
})
export class HabitTaskService extends RxState<HabitTaskState> {
  private readonly LOCAL_STORAGE_KEY = 'habitTasks';

  constructor() {
    super();
    const savedTasks = this.getTasksFromLocalStorage();
    this.set({
      tasks: savedTasks,
      predefinedHabits: []
    });
  }

  getTasks(): Observable<Task[]> {
    return this.select('tasks');
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newId = Math.max(...this.get('tasks').map(t => t.id), 0) + 1;
    const newTask: Task = {
      ...task,
      id: newId,
    };

    const reduceFn = (oldState: HabitTaskState) => ({
      predefinedHabits: [],
      tasks: [...oldState.tasks, newTask]
    });

    this.set(reduceFn);
    this.saveTasksToLocalStorage(this.get('tasks')); // Save to local storage
  }

  removeTask(id: number): void {
    const reduceFn = (oldState: HabitTaskState) => ({
      predefinedHabits: [],
      tasks: oldState.tasks.filter(task => task.id !== id)
    });

    this.set(reduceFn);
    this.saveTasksToLocalStorage(this.get('tasks')); // Save updated tasks to local storage
  }

  private getTasksFromLocalStorage(): Task[] {
    const tasksJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return tasksJson ? JSON.parse(tasksJson) : [];
  }

  private saveTasksToLocalStorage(tasks: Task[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }
}
