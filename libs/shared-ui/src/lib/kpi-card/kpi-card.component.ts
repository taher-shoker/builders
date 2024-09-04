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
  showFullText = false;
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  // @Input({required:true}) costData!:CostModel;
  ngOnChanges(): void {
    if(this.kpiData().details)
    {
      const textArr:string[] = this.kpiData().details?.trim()?.split(' ') ?? [];
      const filteredArray = textArr.filter(item => item !== '');
      this.maxTextLength = filteredArray.length;
      console.log(filteredArray);
      
    }
  }
  kpiData:InputSignal<KpiModel> = input.required<KpiModel>({alias : 'kpi'});
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  toggleReadMore() {
    this.showFullText = !this.showFullText;
  }
}
