/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { KpiItem } from '../../models/http-response.model';

@Component({
  selector: 'stc-apps-kpis-holder',
  templateUrl: './kpis-holder.component.html',
  styleUrls: ['./kpis-holder.component.scss'],
})
export class KpisHolderComponent implements OnChanges{

  @Output() kpiClick: EventEmitter<string> = new EventEmitter<string>();
  didIEmitAlready: boolean = false; // this will be true once the component starts and sends it ONCE in ngOnChanges

  @Input() kpis! : KpiItem[];
  id!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['kpis'] && !changes['kpis'].firstChange) {
      this.kpis = changes['kpis'].currentValue;
      this.id = this.kpis[0].kpiId

      if(!this.didIEmitAlready){
        this.kpiClick.emit(this.id)
      }
      console.log("id", this.id)
    }
  }

  handleCardClick(id: string){
    console.log("id of card :", id)
    this.id = id
    this.kpiClick.emit(this.id)

  }
}
