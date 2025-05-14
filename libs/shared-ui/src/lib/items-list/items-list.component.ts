/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DialogService } from '../dialog/dialog.service';

interface Item {
  id: number;
  externalSystemId: number;
  selected?: boolean;
  taskName: string;
  createdDate: Date;
  taskStatus: string;
  requestParams: { milestone_name: string; team: string };
  [key: string]: any;
}
@Component({
  selector: 'stc-apps-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
  standalone: false,
})
export class ItemsListComponent implements OnChanges {
  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() bulkApproveEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() submitBulk: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() cancelBulk: EventEmitter<void> = new EventEmitter<void>();

  @Input({ required: true }) caption = '';
  @Input() iconClass = '';
  @Input() bulkApprove = false;
  @Input() showBulkRequests = false;
  @Input() closable = false;
  @Input() itemMsg: string = "Milestone's current pending action is :";

  private _items: any[] = [];
  @Input({ required: true })
  set items(value: any[]) {
    this._items = value?.map((item) => ({ ...item })) || [];
    this.prepareSelectedItems();
  }
  get items(): any[] {
    return this._items;
  }

  showApproveBtns = false;
  selectedItems: any[] = [];

  constructor(protected dialogService: DialogService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bulkApprove'] && this.bulkApprove) {
      this.prepareSelectedItems();
    }
  }

  private prepareSelectedItems(): void {
    if (this.bulkApprove && this.items.length > 0) {
      this.selectedItems = [];
      this.items.forEach((item) => {
        item.selected = true;
        this.selectedItems.push(item);
      });
      console.log(
        'All items selected (via setter or OnChanges):',
        this.selectedItems
      );
    }
  }

  clickItem(item: any): void {
    this.itemClicked.emit(item);
  }

  toggleBulk(): void {
    this.toggleApproveState(true);
    this.bulkApproveEvent.emit();
  }

  cancelApprove(): void {
    this.toggleApproveState(false);
    this.cancelBulk.emit();
  }

  onSubmit(): void {
    this.dialogService.close();
    this.showApproveBtns = false;
    const selectedIds = this.selectedItems.map((i) => i.externalSystemId);
    this.submitBulk.emit(selectedIds);
  }

  approveBulk(): void {
    this.dialogService.open('bulk-approve');
  }

  onTaskCheckboxChange(event: Event, item: any): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    item.selected = isChecked;

    if (isChecked) {
      const exists = this.selectedItems.some((i) => i.id === item.id);
      if (!exists) {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = this.selectedItems.filter((i) => i.id !== item.id);
    }

    console.log('Selected Items:', this.selectedItems);
  }

  notifyParent(): void {
    if (this.bulkApprove) {
      this.toggleApproveState(false);
    }
    this.closeClicked.emit();
  }
  private toggleApproveState(show: boolean): void {
    this.showApproveBtns = show;
    this.showBulkRequests = show;
  }
}
