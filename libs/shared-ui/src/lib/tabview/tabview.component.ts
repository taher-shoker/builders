import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TabsDataModel } from './tabsData.model';
@Component({
  selector: 'stc-apps-tabview',
  standalone: false,
  templateUrl: './tabview.component.html',
  styleUrl: './tabview.component.scss',
})
export class TabviewComponent {
  @Input({required : true}) tabsData!:TabsDataModel[];
  @Input() tabColor!:string;
  @Input() clickedtabColor!:string;
  @Input() clickedtabBackground!:string;
  @Input() tabBackground!:string;
  @Output() clickedTap:EventEmitter<TabsDataModel> = new EventEmitter()
  currentClickedTapIndex = 0;
  toggleTaps(index:number , tap:TabsDataModel)
  {
    this.currentClickedTapIndex = index;
    this.clickedTap.emit(tap)
  }
}
