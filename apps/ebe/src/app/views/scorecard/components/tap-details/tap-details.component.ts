import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FinancialScorecardModel,
  ScorecardTaps,
} from '../../../../models/scorecard.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ScorecardService } from '../../../../services/scorecard.service';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'stc-apps-tap-details',
  standalone: true,
  imports: [
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    FileUploadModule,
  ],
  templateUrl: './tap-details.component.html',
  styleUrl: './tap-details.component.scss',
})
export class TapDetailsComponent implements OnInit {
  financialScorcardData: InputSignal<FinancialScorecardModel[]> =
    input.required<FinancialScorecardModel[]>();
  currentMode: InputSignal<'editMode' | 'viewMode'> = input.required<
    'editMode' | 'viewMode'
  >();
  currentClickedTap: InputSignal<ScorecardTaps> =
    input.required<ScorecardTaps>();
  monthsArr: { name: string; id: number }[] = [];
  years: WritableSignal<{ name: string; id: number }[]> = signal<
    { name: string; id: number }[]
  >([]);
  filtersForm: FormGroup = new FormGroup({
    month: new FormControl(new Date().getMonth() + 1),
    year: new FormControl(new Date().getFullYear()),
  });
  scorecardService = inject(ScorecardService);
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
  get monthValue() {
    return this.filtersForm.get('month');
  }
  get yearValue() {
    return this.filtersForm.get('year');
  }
  selectYear() {
    console.log('month value => ', this.monthValue?.value);
    console.log('year value => ', this.yearValue?.value);
  }
  selectMonth() {
    console.log('month value => ', this.monthValue?.value);
    console.log('year value => ', this.yearValue?.value);
  }
  getUploadedFile(e: Event) {
    if (e.target && (e.target as HTMLInputElement).files) {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log(files);
      }
    }
  }
}
