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
  title = input<string>('');
  items: InputSignal<any> = input<[]>([]);

  completedItems: {
    id: number;
    apiUrl: string;
    standardId: string;
    standardList: string[];
    hasRun?: boolean;
    hasCompleted?: boolean;
    date?: number;
    time?: number;
  }[] = [];
  @Output() itemsChange = new EventEmitter<
    {
      id: number;
      apiUrl: string;
      standardId: any;
      standardList: string[];
      hasRun?: boolean;
    }[]
  >();

  @Output() removedItems = new EventEmitter<
    {
      id: number;
      apiUrl: string;
      standardId: string;
      standardList: string[];
    }[]
  >();

  @Output() addAndRunItem = new EventEmitter<{
    id: number;
    apiUrl: string;
    standardId: string;
    version: string;
    standardList: string[];
  }>();

  @Output() itemSelected = new EventEmitter<{
    id: number;
    apiUrl: string;
    standardId: string;
    version: string;
    standardList: string[];
  }>();
  @Output() standardChanged = new EventEmitter<{ value: any; index: number }>();
  selectedItem: any;

  removeItem(index: number): void {
    const updatedItems = [...this.items()];
    updatedItems.splice(index, 1);
    this.removedItems.emit(updatedItems);
  }

  runAll(): void {
    const updatedItems = this.items().map((item: any) => ({
      ...item,
      hasRun: true,
      date: new Date(),
      result: 'pass',
    }));
    this.itemsChange.emit(updatedItems);
    this.moveToCompleted(updatedItems);
  }

  moveToCompleted(updatedItems: any[]): void {
    const completedItems = updatedItems
      .filter((item) => item.hasRun)
      .map((item) => ({
        ...item,
        hasCompleted: true,
      }));

    this.completedItems.unshift(...completedItems);
  }

  onItemClick(item: any): void {
    if (this.title() === 'Completed Tests') {
      this.selectedItem = this.selectedItem === item ? null : item;
      this.itemSelected.emit(this.selectedItem);
    }
  }

  onStandardChanged(value: any, index: number) {
    this.standardChanged.emit({ value, index });
  }
}
