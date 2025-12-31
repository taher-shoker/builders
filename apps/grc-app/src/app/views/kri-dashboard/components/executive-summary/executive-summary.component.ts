import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  DPKRIsModel,
  ExecutiveSummaryModel,
  KRIModel,
  TapModel,
} from '../../../../models';
import { ExecutiveSummaryService } from '../../../../services/executive-summary.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-executive-summary',
  standalone: false,
  templateUrl: './executive-summary.component.html',
  styleUrl: './executive-summary.component.scss',
})
export class ExecutiveSummaryComponent implements OnInit, OnDestroy {
  quarters: { name: string; id: number | string }[] = [];
  currQuarter = 'Q1';
  executiveSummaryData!: ExecutiveSummaryModel;
  currQuarterType = 'Quarter';
  quarterTypes: { name: string; id: number }[] = [];
  yearsdata: { name: string; id: number }[] = [];
  quartersMonthTypes: { name: string; id: number }[] = [];
  KrisDropdownData: { name: string; id: number }[] = [];
  statusLegends: { name: string; color: string }[] = [];
  kriTaps = input.required<TapModel[]>();
  selectedQuarterType!: string;
  KriData: KRIModel[] = [];
  DPKRIsData: DPKRIsModel[] = [];
  KRITrendAnalysisData: any[] = [];
  showUploadFileDialog = false;
  endSub$: Subject<void> = new Subject<void>();
  executiveSummaryService = inject(ExecutiveSummaryService);
  filtersForm: FormGroup = new FormGroup({
    quarter: new FormControl(this.currQuarter),
    quarterType: new FormControl('Quarter'),
    year: new FormControl(new Date().getFullYear()),
  });
  KrisfiltersForm: FormGroup = new FormGroup({
    kriCategory: new FormControl(0),
  });
  monthQuarterFilter: FormGroup = new FormGroup({
    quarterFilter: new FormControl(1),
  });
  donutColors = ['#22C55E', '#EAB308', '#DC2626'];
  donatChartData: { category: string; value: number; color?: string }[] = [];
  KRIStatusPerGDChartData: any[] = [];
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
    this.KrisDropdownData = [{ name: 'ALL', id: 0 }, ...this.kriTaps()];
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
    this.getExecutiveSummaryData();
  }
  ngOnDestroy(): void {
    this.endSub$.complete();
  }
  acceptableNumber = 0;
  private getExecutiveSummaryData() {
    let quarter = this.filtersForm.get('quarter')?.value;
    const quarterType = this.filtersForm
      .get('quarterType')
      ?.value.toUpperCase();
    const year = this.filtersForm.get('year')?.value;
    quarter =
      quarter === 'Jan'
        ? 'January'
        : quarter === 'Feb'
        ? 'February'
        : quarter === 'Mar'
        ? 'March'
        : quarter === 'Apr'
        ? 'April'
        : quarter === 'May'
        ? 'May'
        : quarter === 'Jun'
        ? 'June'
        : quarter === 'Jul'
        ? 'July'
        : quarter === 'Aug'
        ? 'August'
        : quarter === 'Sep'
        ? 'September'
        : quarter === 'Oct'
        ? 'October'
        : quarter === 'Nov'
        ? 'November'
        : quarter === 'Dec'
        ? 'December'
        : this.filtersForm.get('quarter')?.value;
    const gd = this.KrisDropdownData.filter(
      (k) => k.id === this.KrisfiltersForm.get('kriCategory')?.value
    )[0].name;
    this.acceptableNumber = 0;
    this.donatChartData = [];
    this.KRIStatusPerGDChartData = [];
    this.executiveSummaryService
      .getExecutiveSummaryData(year, quarterType, quarter, gd)
      .pipe(takeUntil(this.endSub$))
      .subscribe({
        next: (data: ExecutiveSummaryModel) => {
          console.log('Executive Summary Data:', data);
          this.executiveSummaryData = data;
          if (
            this.executiveSummaryData &&
            this.executiveSummaryData.overallPerformance.length > 0
          ) {
            this.executiveSummaryData.overallPerformance.forEach((item) => {
              this.donatChartData.push({
                category: item.status,
                value: item.percentage,
                color:
                  item.status === 'Acceptable'
                    ? '#22C55E'
                    : item.status === 'Tolerable'
                    ? '#EAB308'
                    : '#DC2626',
              });
            });
            this.acceptableNumber = this.donatChartData.filter(
              (d) => d.category.toLowerCase() === 'acceptable'
            )[0].value;
          } else {
            this.donatChartData = [
              {
                category: 'No Data',
                value: 1,
              },
            ];
          }
          if (
            this.executiveSummaryData &&
            this.executiveSummaryData.kriStatusPerGd.length > 0
          ) {
            const groupedMap = this.executiveSummaryData.kriStatusPerGd.reduce(
              (acc, item) => {
                const key = item.gd;
                if (!acc[key]) {
                  acc[key] = { name: key };
                }
                acc[key][item.status] = item.percentage;
                return acc;
              },
              {} as Record<string, any>
            );
            const finalResult = Object.values(groupedMap);
            this.KRIStatusPerGDChartData = finalResult;
          } else {
            this.KRIStatusPerGDChartData = [];
          }
          if (
            this.executiveSummaryData &&
            this.executiveSummaryData.kriTrendAnalysis.length > 0
          ) {
            //KRITrendAnalysisData
            const groupedData =
              this.executiveSummaryData.kriTrendAnalysis.reduce(
                (acc: any, curr) => {
                  const { quarter, status, percentage } = curr;
                  if (!acc[quarter]) {
                    acc[quarter] = { name: quarter };
                  }
                  acc[quarter][status] = percentage;
                  return acc;
                },
                {}
              );
            const result = Object.values(groupedData);
            this.KRITrendAnalysisData = result;
            console.log(result);
          }
        },
        error: (error) => {
          console.error('Error fetching Executive Summary Data:', error);
        },
      });
  }
  onChangeValue() {
    const quarter = this.filtersForm.get('quarter')?.value;
    const quarterType = this.filtersForm.get('quarterType')?.value;
    this.currQuarterType = quarterType;
    if (quarterType === 'Month') {
      this.quarters = [
        { name: 'Jan', id: 'January' },
        { name: 'Feb', id: 'February' },
        { name: 'Mar', id: 'March' },
        { name: 'Apr', id: 'April' },
        { name: 'May', id: 'May' },
        { name: 'Jun', id: 'June' },
        { name: 'Jul', id: 'July' },
        { name: 'Aug', id: 'August' },
        { name: 'Sep', id: 'September' },
        { name: 'Oct', id: 'October' },
        { name: 'Nov', id: 'November' },
        { name: 'Dec', id: 'December' },
      ];
      const isCurrentValueValid = this.quarters.some((q) => q.name === quarter);
      if (!isCurrentValueValid) {
        this.filtersForm.get('quarter')?.setValue('Jan');
      }
    } else {
      this.quarters = [
        { name: 'Q1', id: 1 },
        { name: 'Q2', id: 2 },
        { name: 'Q3', id: 3 },
        { name: 'Q4', id: 4 },
      ];
      const isCurrentValueValid = this.quarters.some((q) => q.name === quarter);
      if (!isCurrentValueValid) {
        this.filtersForm.get('quarter')?.setValue('Q1');
      }
    }
    this.getExecutiveSummaryData();
  }
  changeGD() {
    this.getExecutiveSummaryData();
  }
  showUploadDialog() {
    this.showUploadFileDialog = true;
  }
  uploadFile(file: File) {
    console.log('File uploaded:', file);
  }
}
