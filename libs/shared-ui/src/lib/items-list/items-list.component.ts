/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'stc-apps-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent {
  @Output() itemClicked : EventEmitter<any> = new EventEmitter<any>();
  @Output() closeClicked : EventEmitter<void> = new EventEmitter<void>();

  @Input({required: true}) caption = "";
  @Input() iconClass = "";

  @Input() closable: boolean = false;
  @Input() itemMsg: string = "Milestone's current pending action is :";

  @Input({required: true}) items: any[] = [];

  clickItem(item: any){
    this.itemClicked.emit(item)
  }

  notifyParent(){
    this.closeClicked.emit();
  }
}
