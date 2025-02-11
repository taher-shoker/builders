import { Component, ElementRef, EventEmitter, HostListener, input , InputSignal, OnChanges , Output, ViewChild } from '@angular/core';
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
  @ViewChild('tabsView') tabsView!: ElementRef;
  tabs2 = [
    'Strategic', 'Operational', 'Test07', 'Test', 'Relational', 
    'Financial', 'Test5', 'Tab6', 'Tab5', 'Tab9', 'Test2', 
    'Txt212', 'Tab7', 'Tab8', 'Corporate', 'Tap2', 'Tap3', 
    'Testttttt', 'Admin', 'Admin123', 'Tap1', 'Tap4'
  ];
  activeIndex = 0;
  tabColor:InputSignal<string> = input<string>('')
  fontFamily:InputSignal<string> = input<string>('')
  @ViewChild('tabsContainer', { static: false }) tabsContainer!: ElementRef;
  @ViewChild('tabs', { static: false }) tabs!: ElementRef;
  onHover = false;
  hoveredTap = 0;
  clickedtabColor:InputSignal<string> = input<string>('')
  clickedtabBackground:InputSignal<string> = input<string>('')
  tabBackground:InputSignal<string> = input<string>('')
  @Output() clickedTap:EventEmitter<TabsDataModel> = new EventEmitter();
  currentIndex = input<number>(0);
  currentClickedTapIndex!:number;
  maxTabs = 0;
  responsiveOptions: any[] | undefined;
  data!:TabsDataModel[];
  isActivityLogTable = input<boolean>(false);
  showArrows = true;
  ngOnInit()
  {
    this.currentClickedTapIndex = this.currentIndex();
    
  }
  ngOnChanges(): void {
    if(this.tabsData())
    {
      this.data = this.tabsData().slice(0,5);
    }
  }
  toggleTaps(index:number , tap:string , tab:TabsDataModel)
  {
    const d = {
      id : index,
      name : tap,
      value :tap
    }
    this.currentClickedTapIndex = index;
    this.clickedTap.emit(tab)
  }
  scrollTabs(direction: number) {
    const container = this.tabsContainer.nativeElement;
    const scrollAmount = 150 * direction; // Adjust scroll step
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
  @HostListener('window:resize')
  checkScreenSize() {
    const container = this.tabsContainer?.nativeElement;
    const tabs = this.tabs?.nativeElement;

    if (container && tabs) {
      this.showArrows = tabs.scrollWidth > container.clientWidth;
    }
  }
  ngAfterViewInit() {
    this.checkScreenSize();
  }
  showMore()
  {
    this.data = this.tabsData()
  }
}
