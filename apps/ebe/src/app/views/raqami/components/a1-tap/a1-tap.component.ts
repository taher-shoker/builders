import { Component, input, InputSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaqamiKpiData } from '../../../../models/raqami.model';
import { RaqamiKpiCardComponent } from '../raqami-kpi-card/raqami-kpi-card.component';

@Component({
  selector: 'stc-apps-a1-tap',
  standalone: true,
  imports: [CommonModule , RaqamiKpiCardComponent],
  templateUrl: './a1-tap.component.html',
  styleUrl: './a1-tap.component.scss',
})
export class A1TapComponent implements OnInit {
  raqamiKpiData:InputSignal<RaqamiKpiData[]> = input.required<RaqamiKpiData[]>();
  ngOnInit(): void {
    console.log(this.raqamiKpiData());
  }
}
