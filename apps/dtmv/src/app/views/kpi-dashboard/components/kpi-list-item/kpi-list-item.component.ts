/* eslint-disable @nx/enforce-module-boundaries */
import {
  Component,
  computed,
  EventEmitter,
  input,
  InputSignal,
  Output,
  effect,
  Input,
} from '@angular/core';
import { LegendSettings } from 'libs/shared-ui/src/lib/chat-charts/line-chart/lineChart.component';
import { KPI } from '../../models/kpi.model';
import { signal } from '@angular/core';
import { AttributeItem } from '../../models/attribute-item.model';

@Component({
  selector: 'stc-apps-kpi-list-item',
  templateUrl: './kpi-list-item.component.html',
  styleUrls: ['./kpi-list-item.component.scss'],
})
export class KpiListItemComponent {
  kpi: InputSignal<KPI> = input.required<KPI>();
  isSelected: InputSignal<boolean> = input(false);
  attributes: InputSignal<AttributeItem[]> = input<AttributeItem[]>([]);
  attributesLoading: InputSignal<boolean> = input(false);
  chartDataInput: InputSignal<any[]> = input<any[]>([]);
  chartGrouping: InputSignal<'monthly' | 'quarterly'> = input<
    'monthly' | 'quarterly'
  >('monthly');
  chartLoading: InputSignal<boolean> = input(false);

  groupingOptions = [
    { id: 'monthly', name: 'Monthly' },
    { id: 'quarterly', name: 'Quarterly' },
  ];

  @Output() selectKpi = new EventEmitter<any>();
  @Output() activityLog = new EventEmitter<KPI>();
  @Output() updateValue = new EventEmitter<KPI>();
  @Output() viewList = new EventEmitter<KPI>();
  @Output() edit = new EventEmitter<KPI>();
  @Output() delete = new EventEmitter<KPI>();
  @Output() groupingChange = new EventEmitter<'monthly' | 'quarterly'>();
  @Input() permissionRole: 'viewer' | 'editor' = 'viewer';

  chartData = signal<any[]>([]);
  hasChartData = computed(() => {
    const d = this.chartDataInput();
    return Array.isArray(d) && d.length > 0;
  });
  colors: string[] = ['#7C3BED'];
  bulletCirclesColor = '#7C3BED';

  legendSettings: LegendSettings = {
    markerCornerRadius: 10,
    markerWidth: 10,
    markerHeight: 10,
    marginTop: 30,
  };
  //  ngOnInit(): void {
  //     // Sync passed chart data to local prop used by template
  //     effect(() => {
  //       const inData = this.chartDataInput();
  //       // console.log('[KPI Item] chartDataInput received', {
  //       //   length: inData?.length ?? 0,
  //       //   sample: inData?.[0],
  //       //   grouping: this.chartGrouping(),
  //       // });
  //       this.chartData.set(inData || []);
  //       // console.log('[KPI Item] local chartData set', {
  //       //   length: this.chartData()?.length ?? 0,
  //       //   sample: this.chartData()?.[0],
  //       // });
  //     });
  //   }
  // Sync passed chart data to local prop used by template
  chartDataSyncEffect = effect(
    () => {
      const inData = this.chartDataInput();
      this.chartData.set(inData || []);
    },
    { allowSignalWrites: true }
  );

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

    const items = rawData.map((monthData) => ({
      x: monthData.x,
      value: monthData.value,
      indicatorName: '',
    }));
    // Set via signal to avoid type errors and ensure reactivity
    this.chartData.set(items);
  }

  onGroupingChange(value: string | string[]): void {
    const v = Array.isArray(value) ? value[0] : value;
    const vStr = (v ?? '').toString().toLowerCase();
    const normalized = vStr === 'quarterly' ? 'quarterly' : 'monthly';
    // console.log('[KPI Item] groupingChange emitted', normalized);
    this.groupingChange.emit(normalized);
  }
}
