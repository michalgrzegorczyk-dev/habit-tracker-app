import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PredefinedHabit, HabitTaskService } from '../habit-task.service';

@Component({
  selector: 'app-predefined-habits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './predefined-habits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PredefinedHabitsComponent implements OnInit {
  predefinedHabits: PredefinedHabit[] = [];
  newHabitName: string = '';
  availableTasks: (Task & { selected: boolean })[] = [];

  constructor(private habitTaskService: HabitTaskService) {
  }

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
