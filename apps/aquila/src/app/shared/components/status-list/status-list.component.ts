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
  items: InputSignal<
    {
      id: number;
      apiUrl: string;
      standardId: any;
      version: string;
      standardList: any[];
      hasRun?: boolean;
      hasCompleted?: boolean;
      date?: Date;
      result?: string;
    }[]
  > = input<
    {
      id: number;
      apiUrl: string;
      standardId: string;
      version: string;
      standardList: string[];
      hasRun?: boolean;
    }[]
  >([]);

  completedItems: {
    id: number;
    apiUrl: string;
    standardId: string;
    version: string;
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
      standardId: string;
      version: string;
      standardList: string[];
      hasRun?: boolean;
    }[]
  >();

  @Output() removedItems = new EventEmitter<
    {
      id: number;
      apiUrl: string;
      standardId: string;
      version: string;
      standardList: string[];
    }[]
  >();

  @Output() completedItemsChange = new EventEmitter<
    {
      id: number;
      apiUrl: string;
      standardId: string;
      version: string;
      standardList: string[];
      hasRun?: boolean;
      hasCompleted?: boolean;
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
    const updatedItems = this.items().map((item) => ({
      ...item,
      hasRun: true,
      date: new Date(),
      result: 'pass',
    }));

    this.itemsChange.emit(updatedItems);
    setTimeout(() => {
      this.moveToCompleted(updatedItems);
    }, 3000);
  }

  moveToCompleted(updatedItems: any[]): void {
    const completedItems = updatedItems
      .filter((item) => item.hasRun)
      .map((item) => ({
        ...item,
        hasCompleted: true,
      }));

    this.completedItems.unshift(...completedItems);
    this.completedItemsChange.emit(completedItems);

    const remainingItems = updatedItems.filter((item) => !item.hasRun);
    this.itemsChange.emit(remainingItems);
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
