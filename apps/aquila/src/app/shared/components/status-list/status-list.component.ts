import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { QueueItem } from '../../models/run-test.models';

@Component({
  selector: 'stc-apps-status-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    MatProgressSpinnerModule,
    InputTextModule,
    FormsModule,
  ],
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss'],
})
export class StatusListComponent {
  title: InputSignal<string> = input<string>('');
  items: InputSignal<QueueItem[]> = input<QueueItem[]>([]);
  @Output() itemsChange = new EventEmitter<QueueItem[]>();
  @Output() removedItems = new EventEmitter<QueueItem[]>();
  @Output() addAndRunItem = new EventEmitter<QueueItem>();
  @Output() itemSelected = new EventEmitter<QueueItem | null>();
  @Output() standardChanged = new EventEmitter<{ value: any; index: number }>();

  completedItems: QueueItem[] = [];
  selectedItem: QueueItem | null = null;

  removeItem(index: number): void {
    const updatedItems = [...this.items()];
    updatedItems.splice(index, 1);
    this.removedItems.emit(updatedItems);
  }

  runItem(item: QueueItem): void {
    const updatedItem = {
      ...item,
      hasRun: true,
      date: new Date(),
      result: 'pass',
    };
    this.itemsChange.emit([updatedItem]);
    this.moveToCompleted([updatedItem]);
  }

  runAll(): void {
    const updatedItems = this.items().map((item) => ({
      ...item,
      hasRun: true,
      hasCompleted: false,
      date: new Date(),
      result: 'pass',
    }));
    this.itemsChange.emit(updatedItems);
    this.moveToCompleted(updatedItems);
  }

  moveToCompleted(updatedItems: QueueItem[]): void {
    const completedItems = updatedItems
      .filter((item) => item.hasRun)
      .map((item) => ({
        ...item,
        hasCompleted: true,
      }));

    this.completedItems.unshift(...completedItems);
  }

  onItemClick(item: QueueItem): void {
    if (this.title() === 'Completed Tests') {
      this.selectedItem = this.selectedItem === item ? null : item;
      this.itemSelected.emit(this.selectedItem);
    }
  }

  onStandardChanged(value: any, index: number) {
    this.standardChanged.emit({ value, index });
  }
}
