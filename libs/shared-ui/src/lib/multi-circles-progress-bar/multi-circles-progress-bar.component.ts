import { Component, input , InputSignal, OnInit} from '@angular/core';
@Component({
  selector: 'stc-apps-multi-circles-progress-bar',
  standalone: false,
  templateUrl: './multi-circles-progress-bar.component.html',
  styleUrl: './multi-circles-progress-bar.component.scss',
})
export class MultiCirclesProgressBarComponent implements OnInit{
  // plannedNumber = input.required<number>()
  // actualNumber = input.required<number>()
  chartData:InputSignal<{actual:number , planned:number}> = input.required<{actual:number , planned:number}>()
  colors:InputSignal<string[]> = input.required<string[]>()
  outerRadius:InputSignal<number> = input.required<number>()
  innerRadius:InputSignal<number> = input.required<number>()
  labelsFontFamily:InputSignal<string> = input<string>('')
  legendsFontFamily:InputSignal<string> = input<string>('')
  showLegend:InputSignal<boolean> = input<boolean>(true)
  plannedDegree!:number;
  actualDegree!:number;
  dataKeys:string[] = []
  ngOnInit(): void {
    this.plannedDegree = 360 * (this.chartData().planned / 100);
    this.actualDegree = 360 * (this.chartData().actual / 100);
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
