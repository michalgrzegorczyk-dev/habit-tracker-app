import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredefinedHabit, HabitTaskService } from '../habit-task.service';
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
