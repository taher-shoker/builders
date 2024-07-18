import {
  Component,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { FinancialScorecardModel } from '../../../../models/scorecard.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'stc-apps-financial-scorecard',
  standalone: true,
  imports: [
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './financial-scorecard.component.html',
  styleUrl: './financial-scorecard.component.scss',
})
export class FinancialScorecardComponent implements OnInit {
  financialScorcardData: InputSignal<FinancialScorecardModel[]> = input.required<FinancialScorecardModel[]>();
  monthsArr: { name: string; id: number }[] = [];
  years: WritableSignal<{ name:string , id:number }[]> = signal<{ name:string , id:number }[]>([]);
  filtersForm:FormGroup = new FormGroup({
    month : new FormControl(new Date().getMonth() + 1),
    year : new FormControl(new Date().getFullYear())
  })
  monthsArrPopulator() {
    for (let i = 1; this.monthsArr.length < 12; i++) {
      const date = new Date(2000, i - 1, 10); // 2009-11-10
      const month = date.toLocaleString('default', { month: 'short' });
      const monthObject = { name: month, id: i, selected: false };
      this.monthsArr.push(monthObject);
    }
  }
  ngOnInit(): void {
    const yearsArr: { name: string; id: number }[] = [];
    const currYear: number = new Date().getFullYear();
    for (let index = currYear; index >= 2020; index--) {
      yearsArr.push({ name: index.toString(), id: index });
    }
    this.years.set(yearsArr);
    this.monthsArrPopulator();
  }
  get monthValue()
  {
    return this.filtersForm.get("month");
  }
  get yearValue()
  {
    return this.filtersForm.get("year");
  }
  selectYear()
  {
    console.log("month value => " , this.monthValue?.value);
    console.log("year value => " , this.yearValue?.value);
  }
  selectMonth()
  {
    console.log("month value => " , this.monthValue?.value);
    console.log("year value => " , this.yearValue?.value);
  }
}
