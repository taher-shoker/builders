import {
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  AvailablePeriodModel,
  DPKRIsModel,
  ExecutiveSummaryModel,
  KRIModel,
  TapModel,
  UnacceptableProjectDetails,
} from '../../../../models';
import { ExecutiveSummaryService } from '../../../../services/executive-summary.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'stc-apps-executive-summary',
  standalone: false,
  templateUrl: './executive-summary.component.html',
  styleUrl: './executive-summary.component.scss',
})
export class ExecutiveSummaryComponent implements OnInit, OnDestroy {
  quarters: { name: string; id: number | string }[] = [];
  @Output() isUploaded: EventEmitter<boolean> = new EventEmitter<boolean>();
  currQuarter = 'Q1';
  periods = input.required<AvailablePeriodModel[]>();
  years = input.required<number[]>();
  executiveSummaryData!: ExecutiveSummaryModel;
  currQuarterType = 'Quarter';
  quarterTypes: { name: string; id: number }[] = [];
  toastr = inject(ToastrService);
  yearsdata: { name: string; id: number }[] = [];
  KrisDropdownData: { name: string; id: number }[] = [];
  statusLegends: { name: string; color: string }[] = [];
  kriTaps = input.required<TapModel[]>();
  selectedQuarterType!: string;
  DPKRIsData: DPKRIsModel[] = [];
  KRITrendAnalysisData: any[] = [];
  showUploadFileDialog = false;
  endSub$: Subject<void> = new Subject<void>();
  executiveSummaryService = inject(ExecutiveSummaryService);
  filtersForm: FormGroup = new FormGroup({
    quarter: new FormControl(this.currQuarter),
    quarterType: new FormControl('Quarter'),
    year: new FormControl(),
  });
  KrisfiltersForm: FormGroup = new FormGroup({
    kriCategory: new FormControl(0),
  });
  monthQuarterFilter: FormGroup = new FormGroup({
    quarterFilter: new FormControl(1),
  });
  donutColors = ['#22C55E', '#EAB308', '#DC2626', '#64748B'];
  donatChartData: { category: string; value: number; color?: string }[] = [];
  KRIStatusPerGDChartData: any[] = [];
  ngOnInit() {
    this.quarterTypes = [
      { name: 'Quarter', id: 1 },
      { name: 'Month', id: 2 },
    ];
    this.KrisDropdownData = this.kriTaps();
    this.KrisDropdownData = [{ name: 'ALL', id: 0 }, ...this.kriTaps()];
    this.selectedQuarterType = this.filtersForm.get('quarterType')?.value;
    if (this.years().length !== 0) {
      this.years().forEach((year) => {
        this.yearsdata.push({ name: year.toString(), id: year });
      });
      if (this.yearsdata.length > 0) {
        this.filtersForm.get('year')?.setValue(this.yearsdata[0].id);
      }
    }
    if (this.periods().length > 0) {
      this.quarters = [];
      const filteredPeriod = this.periods().filter(
        (p) => p.year === this.filtersForm.get('year')?.value
      );
      // console.log(filteredPeriod);
      // loop on filteredPeriod to quarters and remove duplicates using Set
      const seen = new Set<string>();
      filteredPeriod.forEach((period) => {
        if (!seen.has(period.quarter)) {
          seen.add(period.quarter);
          this.quarters.push({
            name: period.quarter,
            id: this.quarters.length + 1,
          });
        }
      });
    }
    // for (let year = 2020; year <= new Date().getFullYear(); year++) {
    //   this.yearsdata.push({ name: year.toString(), id: year });
    // }
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
        name: 'Unclassified',
        color: '#64748B',
      },
      {
        name: 'unacceptable',
        color: '#EF4444',
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
          // console.log('Executive Summary Data:', data);
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
                  item.status.toLowerCase() === 'acceptable'
                    ? '#22C55E'
                    : item.status.toLowerCase() === 'tolerable'
                    ? '#EAB308'
                    : item.status.toLowerCase() === 'unclassified'
                    ? '#64748B'
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
            // console.log(result);
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
      this.quarters = [];
      const filteredPeriod = this.periods().filter(
        (p) => p.year === this.filtersForm.get('year')?.value
      );
      filteredPeriod.forEach((period) => {
        this.quarters.push({
          name: period.month.slice(0, 3),
          id: period.month,
        });
      });
      const isCurrentValueValid = this.quarters.some((q) => q.name === quarter);
      if (!isCurrentValueValid) {
        this.filtersForm.get('quarter')?.setValue('Jan');
      }
    } else {
      this.quarters = [];
      const filteredPeriod = this.periods().filter(
        (p) => p.year === this.filtersForm.get('year')?.value
      );
      const seen = new Set<string>();
      filteredPeriod.forEach((period) => {
        if (!seen.has(period.quarter)) {
          seen.add(period.quarter);
          this.quarters.push({
            name: period.quarter,
            id: this.quarters.length + 1,
          });
        }
      });
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
    this.executiveSummaryService.uploadExecutiveSummaryFile(file).subscribe({
      next: () => {
        this.toastr.success('The File is Saved Successfully');
        this.showUploadFileDialog = false;
        this.getExecutiveSummaryData();
        this.isUploaded.emit(true);
      },
      error: (error) => {
        this.toastr.error(error);
        // this.toastr.error('Error while uploading the file');
        this.showUploadFileDialog = false;
      },
    });
  }
  exportExecutiveSummary() {
    this.executiveSummaryService.exportExecutiveSummaryData();
  }
}
