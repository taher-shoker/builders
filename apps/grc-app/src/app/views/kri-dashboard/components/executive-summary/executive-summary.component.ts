import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  statusLegends: { name: string; color: string }[] = [];
  showUploadFileDialog = false;
  filtersForm: FormGroup = new FormGroup({
    quarter: new FormControl(1),
    quarterType: new FormControl(1),
    year: new FormControl(new Date().getFullYear()),
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
