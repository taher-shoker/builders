import { Component, input, InputSignal, OnInit } from '@angular/core';
@Component({
  selector: 'stc-apps-kpi-status-card',
  standalone: false,
  templateUrl: './kpi-status-card.component.html',
  styleUrl: './kpi-status-card.component.scss',
})
export class KpiStatusCardComponent implements OnInit{
  kpiStatus:InputSignal<number | string> = input.required<number | string>();
  isString!:boolean;
  isNumber!:boolean;
  ngOnInit(): void {
    this.isString = typeof this.kpiStatus() === 'string' ? true : false;
    this.isNumber = typeof this.kpiStatus() === 'number' && this.kpiStatus() !== 1 ? true : false
  }
}
