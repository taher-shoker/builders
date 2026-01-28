import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type HeatmapRow = {
  label: string;
  values: number[];
  iconName?: string;
};

@Component({
  selector: 'stc-apps-heatmap-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap-table.component.html',
  styleUrls: ['./heatmap-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatmapTableComponent {
  @Input() columns: string[] = [];
  @Input() rows: HeatmapRow[] = [];
  @Input() showLeftTotalColumn = true;
  @Input() leftTotalColumnTitle = 'Total Tribe';
  @Input() showRightTotalColumn = true;
  @Input() rightTotalColumnTitle = 'Tribe Total';
  @Input() totalRowTitle = 'Total Average';
  @Input() minValue = 0;
  @Input() maxValue = 4;
  @Input() flyMin = 3.5;
  @Input() runMin = 2.5;
  @Input() walkMin = 1.5;

  get displayColumns(): string[] {
    const cols: string[] = [];
    if (this.showLeftTotalColumn) cols.push(this.leftTotalColumnTitle);
    cols.push(...this.columns);
    if (this.showRightTotalColumn) cols.push(this.rightTotalColumnTitle);
    return cols;
  }

  get totalsRow(): number[] {
    const result: number[] = [];
    for (let i = 0; i < this.columns.length; i++) {
      result.push(this.average(this.rows.map(r => r.values[i] ?? 0)));
    }
    return result;
  }

  average(arr: number[]): number {
    if (!arr.length) return 0;
    const sum = arr.reduce((a, b) => a + (b ?? 0), 0);
    return sum / arr.length;
  }

  toFixed(v: number): string {
    return Number.isFinite(v) ? v.toFixed(2) : '0.00';
  }

  private bucketColor(val: number, emphasize = false): string {
    const v = Math.max(this.minValue, Math.min(this.maxValue, val ?? 0));
    if (v >= this.flyMin) {
      return emphasize ? 'linear-gradient(90deg, #8B5CF6 0%, #4F008C 100%)' : '#4F008C';
    }
    if (v >= this.runMin) {
      return emphasize ? 'linear-gradient(90deg, #A78BFA 0%, #7C3AED 100%)' : '#7C3AED';
    }
    if (v >= this.walkMin) {
      return emphasize ? 'linear-gradient(90deg, #FFD19A 0%, #FF9F40 100%)' : '#FF9F40';
    }
    return emphasize ? 'linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 100%)' : '#E5E7EB';
  }

  cellStyle(val: number, isEmphasized = false): Record<string, string> {
    const bg = this.bucketColor(val, true);
    return { background: bg, color: isEmphasized ? '#fff' : '#111827' };
  }
}
