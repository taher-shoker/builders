import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IQuarterTrend } from '../../../../models/db';
import { OverlayPanel } from 'primeng/overlaypanel';
@Component({
  selector: 'stc-apps-kri-card',
  standalone: false,
  templateUrl: './kri-card.component.html',
  styleUrl: './kri-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KriCardComponent {
  quarterTrend: InputSignal<IQuarterTrend> = input.required<IQuarterTrend>();
  @ViewChild('capexOverlay') capexOverlay!: OverlayPanel;
  // chartData: { gd: string; numberOfUnacceptableProjects: number }[] = [];
  readonly chartData = computed(() => {
    const qt = this.quarterTrend();
    return [
      {
        gd: qt.month1Name,
        numberOfUnacceptableProjects:
          qt.month1Value < 0 ? qt.month1Value * -1 : qt.month1Value,
        actualValue: qt.month1Value,
      },
      {
        gd: qt.month2Name,
        numberOfUnacceptableProjects:
          qt.month2Value < 0 ? qt.month2Value * -1 : qt.month2Value,
        actualValue: qt.month2Value,
      },
      {
        gd: qt.month3Name,
        numberOfUnacceptableProjects:
          qt.month3Value < 0 ? qt.month3Value * -1 : qt.month3Value,
        actualValue: qt.month3Value,
      },
    ];
  });
  readonly thresholdsData: any = computed(() => {
    const qt = this.quarterTrend();
    console.log(qt);
    return [
      {
        value: +qt.threshold1,
        label: qt.threshold1,
        color: '#22C55E',
      },
      {
        value: +qt.threshold2,
        label: qt.threshold2,
        color: '#EAB308',
      },
      {
        value: +qt.tolerance100,
        label: qt.tolerance100,
        color: '#DC2626',
      },
    ];
  });
  ngOnInit() {
    // toerance100 => red line
    // threshold1 => green line
    // threshold2 => yellow line
    console.log(this.quarterTrend());
  }
  readonly noData = computed(() => {
    const data = this.chartData();
    return data.every(
      (d) =>
        (d.numberOfUnacceptableProjects &&
          d.numberOfUnacceptableProjects === 0) ||
        !d.numberOfUnacceptableProjects
    );
  });
  showReadMore(title: string): boolean {
    return title.split(' ').length > 5 || title.length > 35;
  }
}
