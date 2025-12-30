import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DPKRIsModel, KRIModel, TapModel } from '../../../../models';
import { ExecutiveSummaryService } from '../../../../services/executive-summary.service';
@Component({
  selector: 'stc-apps-executive-summary',
  standalone: false,
  templateUrl: './executive-summary.component.html',
  styleUrl: './executive-summary.component.scss',
})
export class ExecutiveSummaryComponent implements OnInit {
  quarters: { name: string; id: number }[] = [];
  quarterTypes: { name: string; id: number }[] = [];
  yearsdata: { name: string; id: number }[] = [];
  quartersMonthTypes: { name: string; id: number }[] = [];
  KrisDropdownData: { name: string; id: number }[] = [];
  statusLegends: { name: string; color: string }[] = [];
  kriTaps = input.required<TapModel[]>();
  selectedQuarterType!: string;
  KriData: KRIModel[] = [];
  DPKRIsData: DPKRIsModel[] = [];
  showUploadFileDialog = false;
  executiveSummaryService = inject(ExecutiveSummaryService);
  filtersForm: FormGroup = new FormGroup({
    quarter: new FormControl('Q1'),
    quarterType: new FormControl('Quarter'),
    year: new FormControl(new Date().getFullYear()),
  });
  KrisfiltersForm: FormGroup = new FormGroup({
    kriCategory: new FormControl(1),
  });
  monthQuarterFilter: FormGroup = new FormGroup({
    quarterFilter: new FormControl(1),
  });
  donutColors = ['#22C55E', '#EAB308', '#DC2626'];
  donatChartData = [
    { category: 'Acceptable', value: 70 },
    { category: 'Tolerable', value: 20 },
    { category: 'Unacceptable', value: 10 },
  ];
  ngOnInit() {
    this.quarters = [
      { name: 'Q1', id: 1 },
      { name: 'Q2', id: 2 },
      { name: 'Q3', id: 3 },
      { name: 'Q4', id: 4 },
    ];
    this.quarterTypes = [
      { name: 'Quarter', id: 1 },
      { name: 'Month', id: 2 },
    ];
    this.KrisDropdownData = this.kriTaps();
    this.KrisDropdownData.unshift({ name: 'All', id: 0 });
    this.selectedQuarterType = this.filtersForm.get('quarterType')?.value;
    for (let year = 2020; year <= new Date().getFullYear(); year++) {
      this.yearsdata.push({ name: year.toString(), id: year });
    }
    this.statusLegends = [
      {
        name: 'Acceptable',
        color: '#22C55E',
      },
      {
        name: 'tolerable',
        color: '#EAB308',
      },
      {
        name: 'unacceptable',
        color: '#EF4444',
      },
    ];
    this.KriData = [
      {
        id: 1,
        title:
          'Percentage deviation of DQHI against target - PCRF-Fixed (source system)',
        category: 'DP',
        value: 50,
      },
      {
        id: 1,
        title:
          'Percentage deviation of DQHI against target - PCRF-Fixed (source system)',
        category: 'DP',
        value: 20,
      },
      {
        id: 1,
        title:
          'Percentage deviation of DQHI against target - PCRF-Fixed (source system)',
        category: 'Excellence',
        value: 84,
      },
      {
        id: 1,
        title:
          'Percentage deviation of DQHI against target - PCRF-Fixed (source system)',
        category: 'AI',
        value: 23,
      },
      {
        id: 1,
        title:
          'Percentage deviation of DQHI against target - PCRF-Fixed (source system)',
        category: 'EBU',
        value: 10,
      },
      {
        id: 1,
        title:
          'Percentage deviation of DQHI against target - PCRF-Fixed (source system)',
        category: 'Jawwy',
        value: 100,
      },
    ];
    // this.getExecutiveSummaryData();
  }
  private getExecutiveSummaryData() {
    const quarter = this.filtersForm.get('quarter')?.value;
    const quarterType = this.filtersForm.get('quarterType')?.value;
    const year = this.filtersForm.get('year')?.value;
    console.log(quarter, quarterType, year);
    this.executiveSummaryService
      .getExecutiveSummaryData(year, 'quarter', 'q1', 'ALL')
      .subscribe({
        next: (data) => {
          console.log('Executive Summary Data:', data);
        },
        error: (error) => {
          console.error('Error fetching Executive Summary Data:', error);
        },
      });
  }
  onChangeValue() {
    const quarter = this.filtersForm.get('quarter')?.value;
    const quarterType = this.filtersForm.get('quarterType')?.value;
    const year = this.filtersForm.get('year')?.value;
    console.log(quarter, quarterType, year);
  }
  selectMonth() {
    console.log('Month selected');
  }
  showUploadDialog() {
    this.showUploadFileDialog = true;
  }
  uploadFile(file: File) {
    console.log('File uploaded:', file);
  }
}
