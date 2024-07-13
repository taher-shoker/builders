import { Component, EventEmitter, input , Output } from '@angular/core';
import { TabsDataModel } from './tabsData.model';
@Component({
  selector: 'stc-apps-tabview',
  standalone: false,
  templateUrl: './tabview.component.html',
  styleUrl: './tabview.component.scss',
})
export class TabviewComponent {
  // @Input({required : true}) tabsData!:TabsDataModel[];
  tabsData = input.required<TabsDataModel[]>()
  tabColor = input<string>()
  fontFamily = input<string>()
  onHover = false;
  hoveredTap = 0;
  clickedtabColor = input<string>()
  clickedtabBackground = input<string>()
  tabBackground = input<string>()
  @Output() clickedTap:EventEmitter<TabsDataModel> = new EventEmitter()
  currentClickedTapIndex = 0;
  toggleTaps(index:number , tap:TabsDataModel)
  {
    this.currentClickedTapIndex = index;
    this.clickedTap.emit(tap)
  }
}
