import { Component, input , InputSignal, OnChanges, OnInit, SimpleChanges} from '@angular/core';
@Component({
  selector: 'stc-apps-multi-circles-progress-bar',
  standalone: false,
  templateUrl: './multi-circles-progress-bar.component.html',
  styleUrl: './multi-circles-progress-bar.component.scss',
})
export class MultiCirclesProgressBarComponent implements OnInit , OnChanges{
  // plannedNumber = input.required<number>()
  // actualNumber = input.required<number>()
  chartData:InputSignal<{actual:number | null , planned:number  | null}> = input.required<{actual:number  | null , planned:number  | null}>()
  colors:InputSignal<string[]> = input.required<string[]>()
  outerRadius:InputSignal<number> = input.required<number>()
  innerRadius:InputSignal<number> = input.required<number>()
  labelsFontFamily:InputSignal<string> = input<string>('')
  legendsFontFamily:InputSignal<string> = input<string>('')
  showLegend:InputSignal<boolean> = input<boolean>(true)
  showLabels:InputSignal<boolean> = input<boolean>(true)
  showLegendValues:InputSignal<boolean> = input<boolean>(true)
  plannedDegree!:number;
  actualDegree!:number;
  dataKeys:string[] = []
  ngOnInit(): void {
    this.plannedDegree = 360 * (
      this.chartData() && this.chartData().planned ? (this.chartData().planned! / 100) : 0
    );
    this.actualDegree = 360 * (
      this.chartData() && this.chartData().actual ? (this.chartData().actual! / 100) : 0
    );
    this.dataKeys = Object.keys(this.chartData());
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.plannedDegree = 360 * (
      this.chartData() && this.chartData().planned ? (this.chartData().planned! / 100) : 0
    );
    this.actualDegree = 360 * (
      this.chartData() && this.chartData().actual ? (this.chartData().actual! / 100) : 0
    );
    this.dataKeys = Object.keys(this.chartData());
  }
  get actualStyles() {
    return {
      'background': `conic-gradient(${this.colors()[0]} ${this.actualDegree}deg , #F1F1F1 0deg)`
    };
  }
  get plannedStyles() {
    return {
      'background': `conic-gradient(${this.colors()[1]} ${this.plannedDegree}deg , #F1F1F1 0deg)`
    };
  }
}
