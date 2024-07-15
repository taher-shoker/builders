import { Component, input, InputSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { FinancialScorecardModel } from '../../../../models/scorecard.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
@Component({
  selector: 'stc-apps-financial-scorecard',
  standalone: true,
  imports : [SharedUiModule , FormsModule , ReactiveFormsModule],
  templateUrl: './financial-scorecard.component.html',
  styleUrl: './financial-scorecard.component.scss',
})
export class FinancialScorecardComponent implements OnInit {
  // @Input({required : true}) financialScorcardData!:FinancialScorecardModel;
  financialScorcardData:InputSignal<FinancialScorecardModel> = input.required<FinancialScorecardModel>();
  currentMonth!:string;
  currentYear!:number;
  monthsArr:{name:string , id:number}[] = []
  years:WritableSignal<number[]> = signal<number[]>([])
  filtersForm:FormGroup = new FormGroup({
    month : new FormControl(null),
    year : new FormControl(null)
  });
  monthsArrPopulator() {
    for (let i = 1; this.monthsArr.length < 12; i++) {
      const date = new Date(2000, i - 1, 10); // 2009-11-10
      const month = date.toLocaleString('default', { month: 'long' });

      const monthObject = { name: month, id: i };
      this.monthsArr.push(monthObject);
    }
    console.log(this.monthsArr);
  }
  ngOnInit(): void {
    const yearsArr:number[] = []
    const currYear:number = new Date().getFullYear();
    for (let index = currYear; index >= 2020; index--) {
      yearsArr.push(index)
    }
    this.years.set(yearsArr);
    // const currMonth = new Date().getMonth();
    // this.currentMonth = this.months()[currMonth];
    // this.currentYear = new Date().getFullYear();
    this.monthsArrPopulator();
  }
}
