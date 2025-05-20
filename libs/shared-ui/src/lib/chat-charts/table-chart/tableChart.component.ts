import {
  Component,
  computed,
  effect,
  HostListener,
  input,
  InputSignal,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'stc-apps-table-chat-chart',
  templateUrl: './tableChart.component.html',
  styleUrl: './tableChart.component.scss',
})
export class TableChartComponent implements OnInit {
  tableData: InputSignal<any[]> = input([{}]);
  chartTitle: InputSignal<string> = input('');

  dataSource = computed(() => this.tableData() || []);

  displayedColumns = computed(() =>
    this.dataSource().length > 0 ? Object.keys(this.dataSource()[0]) : []
  );
  isMobileScreen = false;

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }
  ngOnInit() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileScreen = window.innerWidth <= 768;
  }
}
