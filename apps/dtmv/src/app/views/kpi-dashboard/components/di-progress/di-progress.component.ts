/* eslint-disable @nx/enforce-module-boundaries */
import { AfterViewInit, Component, input, InputSignal, effect } from '@angular/core';
import { LegendSettings } from 'libs/shared-ui/src/lib/chat-charts/line-chart/lineChart.component';
import * as am5 from '@amcharts/amcharts5';
import { KpiService, UnitSeriesItem } from '../../kpi.service';

@Component({
  selector: 'stc-apps-di-progress',
  templateUrl: './di-progress.component.html',
  styleUrls: ['./di-progress.component.scss'],
})
export class DiProgressComponent implements AfterViewInit {
  title: InputSignal<string> = input('');
  unitId: InputSignal<number | null> = input<number | null>(null);
  teamName: InputSignal<string> = input('');
  year: InputSignal<number | string> = input<number | string>('');

  chartData: any[] = [];
  // Dropdowns
  dimensionsOptions = [
    { id: 'All', name: 'All' },
    { id: 'Capability Building', name: 'Capability Building' },
    { id: 'Digital Experience & Impact', name: 'Digital Experience & Impact' },
    { id: 'Capability Utilization', name: 'Capability Utilization' },
    { id: 'Overall', name: 'Overall' },
  ];
  periodOptions = [
    { id: 'monthly', name: 'Monthly' },
    { id: 'weekly', name: 'Weekly' },
  ];
  selectedDimension = 'All';
  selectedPeriod: 'monthly' | 'weekly' = 'monthly';
  legendSettings: LegendSettings = {
    layout: 'horizontal',
    itemSpacing: 10,
    markerCornerRadius: 10,
    fontSize: 12,
    markerWidth: 10,
    markerHeight: 10,
    marginTop: 30,
    labelCenterY: am5.percent(70),
    colors: [
      '#277FF1', // Capability Building
      '#FFA500', // Capability Utilization
      '#00C48C', // Digital Experience & Impact
      '#4F008C', // Overall (Total)
    ],
  };

  ngAfterViewInit(): void {
    // Perform an initial fetch if unitId is already available
    const id = this.unitId();
    if (id != null && this.chartData.length === 0) {
      this.fetchSeries(id);
    }
  }

  onDimensionChange(value: string): void {
    this.selectedDimension = value as any;
    const id = this.unitId();
    if (id != null) this.fetchSeries(id);
  }

  onPeriodChange(value: string): void {
    this.selectedPeriod = (value === 'Weekly' || value === 'weekly') ? 'weekly' : 'monthly';
    const id = this.unitId();
    if (id != null) this.fetchSeries(id);
  }

  private fetchSeries(unitId: number): void {
    const yrRaw = this.year();
    const yrNum = typeof yrRaw === 'string' ? Number(yrRaw) : (typeof yrRaw === 'number' ? yrRaw : undefined);
    this.kpiService.getUnitSeries(unitId, this.selectedPeriod, Number.isFinite(yrNum as number) ? (yrNum as number) : undefined).subscribe({
      next: (items: UnitSeriesItem[]) => {
        // Available dimensions (fixed order)
        const allDimensions = [
          'Capability Building',
          'Capability Utilization',
          'Digital Experience & Impact',
          'Overall',
        ];

        // Determine which dimensions to render based on selection
        const dimsToRender =
          this.selectedDimension === 'All' || !allDimensions.includes(this.selectedDimension)
            ? allDimensions
            : [this.selectedDimension];

        // Group by period
        const byPeriod = new Map<number, UnitSeriesItem[]>();
        items.forEach((i) => {
          const arr = byPeriod.get(i.period) || [];
          arr.push(i);
          byPeriod.set(i.period, arr);
        });

        const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        const dataRows = Array.from(byPeriod.entries())
          .sort((a,b) => a[0]-b[0])
          .map(([period, arr]) => {
            const xLabel = this.selectedPeriod === 'monthly'
              ? monthNames[(period-1) % 12] || String(period)
              : `Wk ${period}`;

            const row: any = { x: xLabel };
            dimsToRender.forEach((dim, idx) => {
              const rec = arr.find(a => a.dimension === dim);
              const pct = rec && typeof rec.diActualProgress === 'number'
                ? parseFloat((rec.diActualProgress * 100).toFixed(2))
                : null; // use null to create gaps when missing
              const key = `value${idx+1}`;
              const nameKey = `indicatorName${idx+1}`;
              row[key] = pct;
              // Use team name for Overall series label
              if (dim === 'Overall') {
                const tn = (this.teamName() || '').trim();
                row[nameKey] = tn ? `${tn} DI (Overall)` : 'DI (Overall)';
              } else {
                row[nameKey] = dim;
              }
            });
            return row;
          });

        // Update legend colors to match the rendered dimensions order
        const colorMap: Record<string, string> = {
          'Capability Building': '#277FF1',
          'Capability Utilization': '#00C48C',
          'Digital Experience & Impact': '#FF6A39',
          Overall: '#4F008C',
        };
        const newColors = dimsToRender.map((d) => colorMap[d]);
        this.legendSettings = { ...this.legendSettings, colors: newColors };

        this.chartData = dataRows;
      },
      error: () => {
        this.chartData = [];
      }
    });
  }

  constructor(private kpiService: KpiService) {
    // Run effect in injection context (constructor) to avoid NG0203
    effect(() => {
      const id = this.unitId();
      if (id != null) {
        this.fetchSeries(id);
      }
    });
  }
}
