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

  constructor() {
    super();
    this.set({
      tasks: [],
      predefinedHabits: []
    });
  }

  getTasks(): Observable<Task[]> {
    return this.select('tasks');
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newId = Math.max(...this.get('tasks').map(t => t.id), 0) + 1
    const newTask: Task = {
      ...task,
      id: newId,
    };

    const reduceFn = (oldState: HabitTaskState) => ({
      predefinedHabits: [],
      tasks: [...oldState.tasks, newTask]
    });
    this.set(reduceFn);
  }

  removeTask(id: number): void {
    const reduceFn = (oldState: HabitTaskState) => ({
      predefinedHabits: [],
      tasks: oldState.tasks.filter(task => task.id !== id)
    });
    this.set(reduceFn);
  }

  // Predefined Habit methods
  getPredefinedHabits(): Observable<PredefinedHabit[]> {
    return this.select('predefinedHabits');
  }

  addPredefinedHabit(habit: Omit<PredefinedHabit, 'id'>): void {
    // this.set({
    //   predefinedHabits: (state) => [...state.predefinedHabits, { ...habit }],
    //   nextHabitId: (state) => state.nextHabitId + 1
    // });
  }

  removePredefinedHabit(id: number): void {
    // this.set({
    //   predefinedHabits: (state) => state.predefinedHabits.filter(habit => habit.id !== id)
    // });
  }
}
