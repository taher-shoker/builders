/* eslint-disable @typescript-eslint/no-inferrable-types */
import {
  Component,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { AchievedFlag, KpiItem } from '../../models/http-response.model';

export interface KpiData {
  id: string;
  achievedFlag: AchievedFlag;
  kpiName: string;
}
@Component({
  selector: 'stc-apps-kpis-holder',
  templateUrl: './kpis-holder.component.html',
  styleUrls: ['./kpis-holder.component.scss'],
})
export class KpisHolderComponent implements OnChanges {
  @Output() kpiClick: EventEmitter<KpiData> = new EventEmitter<KpiData>();
  didIEmitAlready: boolean = false; // this will be true once the component starts and sends it ONCE in ngOnChanges

  @Input() kpis!: KpiItem[];
  kpisUnfiltered: KpiItem[] = this.kpis;
  id!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpis'] && !changes['kpis'].firstChange) {
      this.kpis = changes['kpis'].currentValue;
      this.kpisUnfiltered = changes['kpis'].currentValue;
      if(this.kpis.length){
        console.log('this.kpis', this.kpis);

        this.id = this.kpis[0]?.kpiId;

        if (!this.didIEmitAlready) {
          this.kpiClick.emit(this.kpiConstructor(this.kpis[0]));
        }
      }
    }
  }

  handleCardClick(card: KpiItem) {
    this.id = card.kpiId;
    this.kpiClick.emit(this.kpiConstructor(card));
  }

  kpiConstructor(kpi: KpiItem): KpiData {
    return {
      kpiName: kpi.kpiName,
      id: kpi.kpiId,
      achievedFlag: kpi.achievedFlag,
    };
  }

  filterText(text: string){

    console.log("El text", text)
    this.kpis = this.kpisUnfiltered.filter(kpi => kpi.kpiName.includes(text))
    console.log("this.kpis", this.kpis)
  }
}
