import { Component, input, InputSignal, OnChanges, ViewChild } from '@angular/core';
import { KpiModel } from './kpi.model';
import { OverlayPanel } from 'primeng/overlaypanel';
// import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'stc-apps-kpi-card',
  standalone: false,
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent implements OnChanges {
  maxTextLength = 0; // Adjust the maximum length as needed
  maxTitleLength = 0; // Adjust the maximum length as needed
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  showFullText = false;
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  // @Input({required:true}) costData!:CostModel;
  ngOnChanges(): void {
    if(this.kpiData().details)
    {
      const textArr:string[] = this.kpiData().details?.trim()?.split(' ') ?? [];
      const filteredArray = textArr.filter(item => item !== '');
      this.maxTextLength = filteredArray.length;
    }
    if(this.kpiData().title)
    {
      const textArr:string[] = this.kpiData().title.trim()?.split(' ') ?? [];
      const filteredArray = textArr.filter(item => item !== '');
      this.maxTitleLength = filteredArray.length;
    }
  }
  kpiData:InputSignal<KpiModel> = input.required<KpiModel>({alias : 'kpi'});
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  displayDrilldown2()
  {
    this.overlayPanel2.toggle(event);
  }
  toggleReadMore() {
    this.showFullText = !this.showFullText;
  }
}
