// task-manager.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Task {
  id: number;
  description: string;
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private nextTaskId = 1;

  constructor() {
    // Initialize with some sample tasks
    this.addTask('Drink water', 'Health');
    this.addTask('Read a book', 'Personal');
    this.addTask('Exercise', 'Health');
  }

  addTask(description: string, category: string) {
    const newTask: Task = {
      id: this.nextTaskId++,
      description,
      category
    };
    this.tasks.push(newTask);
    this.tasksSubject.next(this.tasks);
  }

  getTasks() {
    return this.tasks;
  }
}
