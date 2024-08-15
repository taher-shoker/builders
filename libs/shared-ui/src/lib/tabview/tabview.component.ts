import { Component, EventEmitter, input , InputSignal, OnChanges , Output } from '@angular/core';
import { TabsDataModel } from './tabsData.model';
@Component({
  selector: 'stc-apps-tabview',
  standalone: false,
  templateUrl: './tabview.component.html',
  styleUrl: './tabview.component.scss',
})
export class TabviewComponent implements OnChanges{
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
  data!:TabsDataModel[];
  ngOnChanges(): void {
    if(this.tabsData())
    {
      this.data = this.tabsData().slice(0,5);
    }
  }
  toggleTaps(index:number , tap:TabsDataModel)
  {
    this.currentClickedTapIndex = index;
    this.clickedTap.emit(tap)
  }
  showMore()
  {
    this.data = this.tabsData()
  }
}
