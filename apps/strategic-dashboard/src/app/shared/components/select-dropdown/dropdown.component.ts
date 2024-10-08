import { Component, OnInit } from '@angular/core';
import { YearService } from '../../services/year.service';
import { SharedFormService } from '../../services/shared-form.service';
import { FormGroup } from '@angular/forms';
interface name {
  name: string;
}
@Component({
  selector: 'stc-apps-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent implements OnInit {
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear() - 1;
  year = `${this.currentDate.getFullYear()}-FY`;
  form: FormGroup = new FormGroup({});
  yearsArray: name[] = [];
  constructor(
    private yearService: YearService,
    private sharedFormService: SharedFormService
  ) { this.createYearQuarterArray(
    this.currentYear,
    this.currentDate.getFullYear()
  );}
  ngOnInit(): void {
   
    this.handleForm();
  }
  createYearQuarterArray(startYear: number, endYear: number): void {
    for (let year = startYear; year <= endYear; year++) {
      this.yearsArray.push({ name: `${year}-FY` });
      for (let quarter = 1; quarter <= 4; quarter++) {
        this.yearsArray.push({ name: `${year}-Q${quarter}` });
      }
    }
  }
  handleForm() {
    this.form = this.sharedFormService.getForm();

    if (this.yearService.getSelectedYear()) {
      console.log('inside if');
      
      this.year = `${this.yearService.getSelectedYear()!}-${this.yearService.getSelectedQuarter()!}`;
    } else {
      console.log('else');
      this.year = `${this.currentDate.getFullYear()}-FY`;
    }

    const initialParams = {
      year: this.year,
    };
    this.sharedFormService.initializeForm(initialParams);
  }
  selectYear(event: number) {
    this.yearService.setYearQuarter(event.toString());
  }
}
