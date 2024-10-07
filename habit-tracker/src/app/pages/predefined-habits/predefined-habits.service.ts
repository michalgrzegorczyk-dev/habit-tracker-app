import { Injectable, inject, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable, firstValueFrom } from 'rxjs';
import { HabitTaskService } from '../habit-tasks/habit-tasks.service';

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

export interface PredefinedHabitsState {
  tasks: Task[];
  predefinedHabits: PredefinedHabit[];
}
@Injectable({
  providedIn: 'root'
})
export class PredefinedHabitsService extends RxState<PredefinedHabitsState> implements OnInit {
  private readonly LOCAL_STORAGE_KEY = 'predefinedHabits';
  habitTaskService = inject(HabitTaskService);

  constructor() {
    super();
    const savedHabits = this.getPredefinedHabitsFromLocalStorage();
    this.set({
      tasks: [],
      predefinedHabits: savedHabits
    });
  }

  async ngOnInit() {
    const tasks = await firstValueFrom(this.habitTaskService.getTasks());
    this.set({
      tasks: tasks,
    });
  }

  addHabitCollection(habits: Omit<PredefinedHabit, 'id'>[]): void {
    const currentHabits = this.get('predefinedHabits');
    const maxId = Math.max(...currentHabits.map(h => h.id), 0);

    const newHabits = habits.map((habit, index) => ({
      ...habit,
      id: maxId + index + 1
    }));

    this.set(state => ({
      ...state,
      predefinedHabits: [...state.predefinedHabits, ...newHabits]
    }));
    this.savePredefinedHabitsToLocalStorage(this.get('predefinedHabits'));
  }

  getPredefinedHabits(): Observable<PredefinedHabit[]> {
    return this.select('predefinedHabits');
  }

  addPredefinedHabit(habit: Omit<PredefinedHabit, 'id'>): void {
    const newId = Math.max(...this.get('predefinedHabits').map(h => h.id), 0) + 1;
    const newHabit: PredefinedHabit = {
      ...habit,
      id: newId,
    };

    this.set(state => ({
      ...state,
      predefinedHabits: [...state.predefinedHabits, newHabit]
    }));
    this.savePredefinedHabitsToLocalStorage(this.get('predefinedHabits'));
  }

  removePredefinedHabit(id: number): void {
    this.set(state => ({
      ...state,
      predefinedHabits: state.predefinedHabits.filter(habit => habit.id !== id)
    }));
    this.savePredefinedHabitsToLocalStorage(this.get('predefinedHabits'));
  }

  private getPredefinedHabitsFromLocalStorage(): PredefinedHabit[] {
    const habitsJson = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    return habitsJson ? JSON.parse(habitsJson) : [];
  }

  private savePredefinedHabitsToLocalStorage(habits: PredefinedHabit[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(habits));
  }
}
