import { Component, input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FinancialScorecardModel } from '../../../../models/scorecard.model';
import { KpiCardComponent } from '../../../../components/kpi-card/kpi-card.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'stc-apps-financial-scorecard',
  standalone: true,
  imports : [KpiCardComponent , FormsModule],
  templateUrl: './financial-scorecard.component.html',
  styleUrl: './financial-scorecard.component.scss',
})
export class FinancialScorecardComponent implements OnInit {
  // @Input({required : true}) financialScorcardData!:FinancialScorecardModel;
  financialScorcardData:InputSignal<FinancialScorecardModel> = input.required<FinancialScorecardModel>();
  months:Signal<string[]> = signal<string[]>(['Jan' , 'Frb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec']).asReadonly()
  currentMonth!:string;
  currentYear!:number;
  years:WritableSignal<number[]> = signal<number[]>([])
  ngOnInit(): void {
    const yearsArr:number[] = []
    const currYear:number = new Date().getFullYear();
    for (let index = currYear; index >= 2020; index--) {
      yearsArr.push(index)
    }
    const currMonth = new Date().getMonth();
    this.years.set(yearsArr);
    this.currentMonth = this.months()[currMonth];
    this.currentYear = new Date().getFullYear();
  }
}
