/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component } from '@angular/core';
import { PerformanceCard } from '../../models/performance-card.model';

@Component({
  selector: 'stc-apps-kpis-holder',
  templateUrl: './kpis-holder.component.html',
  styleUrls: ['./kpis-holder.component.scss'],
})
export class KpisHolderComponent {

  id: string = '1';

  kpiCards: PerformanceCard[] = [
    {
      id: "1",
      title : "% Completion of External Assessment",
      status: "87 % ( Achieved )",
      delta: 3.32,
      target: 85
    },

    {
      id: "2",
      title : "% Completion of Internal Assessment",
      status: "90 % ( Achieved )",
      delta: 4.32,
      target: 88
    },

    {
      id: "3",
      title : "% Completion of Testing Assessment",
      status: "84 % ( Achieved )",
      delta: 3.60,
      target: 85
    },

    {
      id: "4",
      title : "% Completion of Retesting Assessment",
      status: "87 % ( Achieved )",
      delta: 3.32,
      target: 90
    }
  ]

  handleCardClick(id: string){
    console.log("id of card :", id)
    this.id = id
  }
}
