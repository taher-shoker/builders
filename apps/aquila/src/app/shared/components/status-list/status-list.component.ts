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
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'stc-apps-status-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    MatProgressSpinnerModule,
    DropdownModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
  ],
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.scss'],
})
export class StatusListComponent {
  title: InputSignal<string> = input('');
  items: InputSignal<
    {
      id: number;
      apiLink: string;
      standard: string;
      standardList: string[];
      hasRun?: boolean;
      hasCompleted?: boolean;
    }[]
  > = input<
    {
      id: number;
      apiLink: string;
      standard: string;
      standardList: string[];
      hasRun?: boolean;
    }[]
  >([]);

  completedItems: {
    id: number;
    apiLink: string;
    standard: string;
    standardList: string[];
    hasRun?: boolean;
    hasCompleted?: boolean;
  }[] = [];
  @Output() itemsChange = new EventEmitter<
    {
      id: number;
      apiLink: string;
      standard: string;
      standardList: string[];
      hasRun?: boolean;
    }[]
  >();

  @Output() completedItemsChange = new EventEmitter<
    {
      id: number;
      apiLink: string;
      standard: string;
      standardList: string[];
      hasRun?: boolean;
      hasCompleted?: boolean;
    }[]
  >();

  @Output() addAndRunItem = new EventEmitter<{
    id: number;
    apiLink: string;
    standard: string;
    standardList: string[];
  }>();

  @Output() itemSelected = new EventEmitter<{
    id: number;
    apiLink: string;
    standard: string;
    standardList: string[];
  }>();
  @Output() standardChanged = new EventEmitter<{ value: any; index: number }>();

  removeItem(index: number): void {
    const updatedItems = [...this.items()];
    updatedItems.splice(index, 1);
    this.itemsChange.emit(updatedItems);
  }

  runAll(): void {
    const updatedItems = this.items().map((item) => ({
      ...item,
      hasRun: true,
    }));

    console.log(updatedItems);

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

    this.completedItems.push(...completedItems);
    this.completedItemsChange.emit(completedItems);

    const remainingItems = updatedItems.filter((item) => !item.hasRun);
    this.itemsChange.emit(remainingItems);
  }

  onItemClick(item: any): void {
    if (this.title() === 'Completed Tests') {
      this.itemSelected.emit(item);
    }
  }

  onStandardChanged(value: any, index: number) {
    this.standardChanged.emit({ value, index });
  }
}
