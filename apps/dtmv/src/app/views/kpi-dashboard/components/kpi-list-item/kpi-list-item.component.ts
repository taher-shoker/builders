/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  computed,
  EventEmitter,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { LegendSettings } from 'libs/shared-ui/src/lib/chat-charts/line-chart/lineChart.component';
import { KPI } from '../../models/kpi.model';
import { AttributeItem } from '../../models/attribute-item.model';

@Component({
  selector: 'stc-apps-kpi-list-item',
  templateUrl: './kpi-list-item.component.html',
  styleUrls: ['./kpi-list-item.component.scss'],
})
export class KpiListItemComponent implements OnInit {
  kpi: InputSignal<KPI> = input.required<KPI>();
  isSelected: InputSignal<boolean> = input(false);

  @Output() selectKpi = new EventEmitter<any>();
  @Output() activityLog = new EventEmitter<KPI>();
  @Output() updateValue = new EventEmitter<KPI>();
  @Output() viewList = new EventEmitter<KPI>();
  @Output() edit = new EventEmitter<KPI>();
  @Output() delete = new EventEmitter<KPI>();

  chartData: any[] = [];
  colors: string[] = ['#7C3BED'];
  bulletCirclesColor = '#7C3BED';

  attributes = computed<AttributeItem[]>(() => {
    const kpiData = this.kpi();
    if (!kpiData) return [];

    return [
      {
        label: 'Current Value',
        value: '12,690,000',
        icon: 'assets/images/kpi-dashboard/current-value.svg',
      },
      {
        label: 'Weight 2025',
        value: '6%',
        icon: 'assets/images/kpi-dashboard/weight.svg',
      },
      {
        label: 'Baseline',
        value: '12,690,000',
        icon: 'assets/images/kpi-dashboard/chart-bar.svg',
      },
      {
        label: 'Target',
        value: '10,000,000',
        icon: 'assets/images/kpi-dashboard/target.svg',
      },
      {
        label: 'Ambition',
        value: '12,690,000',
        icon: 'assets/images/kpi-dashboard/ambition.svg',
      },
    ];
  });

  legendSettings: LegendSettings = {
    markerCornerRadius: 10,
    markerWidth: 10,
    markerHeight: 10,
    marginTop: 30,
  };

  ngOnInit(): void {
    this.initializeDummyChartData();
  }

  onActivityLog(kpi: KPI): void {
    this.activityLog.emit(kpi);
  }

  onUpdateValue(kpi: KPI): void {
    this.updateValue.emit(kpi);
  }

  onViewList(kpi: KPI): void {
    this.viewList.emit(kpi);
  }

  onEdit(kpi: KPI): void {
    this.edit.emit(kpi);
  }

  onDelete(kpi: KPI): void {
    this.delete.emit(kpi);
  }

  private initializeDummyChartData(): void {
    const rawData = [
      { x: 'Jan', value: Math.random() * 20 + 60 },
      { x: 'Feb', value: Math.random() * 20 + 65 },
      { x: 'Mar', value: Math.random() * 20 + 70 },
      { x: 'Apr', value: Math.random() * 20 + 75 },
      { x: 'May', value: Math.random() * 20 + 80 },
      { x: 'Jun', value: Math.random() * 20 + 75 },
    ];

    this.chartData = rawData.map((monthData) => {
      return {
        x: monthData.x,
        value: monthData.value,
        indicatorName: '',
      };
    });
  }
}
