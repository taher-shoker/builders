import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'stc-apps-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent {
  @Output() itemClicked : EventEmitter<any> = new EventEmitter<any>();

  @Input({required: true}) caption = "";
  @Input() iconClass = "";

  @Input({required: true}) items: any[] = [];

  clickItem(item: any){
    this.itemClicked.emit(item)
  }
}
