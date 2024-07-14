import { Component, EventEmitter, input , InputSignal, Output } from '@angular/core';
import { TabsDataModel } from './tabsData.model';
@Component({
  selector: 'stc-apps-tabview',
  standalone: false,
  templateUrl: './tabview.component.html',
  styleUrl: './tabview.component.scss',
})
export class TabviewComponent{
  // @Input({required : true}) tabsData!:TabsDataModel[];
  tabsData:InputSignal<TabsDataModel[]> = input.required<TabsDataModel[]>()
  tabColor:InputSignal<string> = input<string>('')
  fontFamily:InputSignal<string> = input<string>('')
  onHover = false;
  hoveredTap = 0;
  clickedtabColor:InputSignal<string> = input<string>('')
  clickedtabBackground:InputSignal<string> = input<string>('')
  tabBackground:InputSignal<string> = input<string>('')
  @Output() clickedTap:EventEmitter<TabsDataModel> = new EventEmitter()
  currentClickedTapIndex = 0;
  toggleTaps(index:number , tap:TabsDataModel)
  {
    this.currentClickedTapIndex = index;
    this.clickedTap.emit(tap)
  }
}
