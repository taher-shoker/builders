import { Component, input, InputSignal, OnInit } from '@angular/core';
import { KpiDTO } from '../../../models/SectorKpisDetails.model';

@Component({
  selector: 'stc-apps-panels-container',
  templateUrl: './panels-container.component.html',
  styleUrl: './panels-container.component.scss',
})
export class PanelsContainerComponent {
  categoryName: InputSignal<string> = input('');
  kpiDTOList: InputSignal<KpiDTO[] | any> = input([]);
  newTabSelected: InputSignal<string> = input('');
  constructor(){
    console.log(this.kpiDTOList())
  }
  getCategoryKeys(): string[] {
    const keys = Object.keys(this.kpiDTOList());
    // console.log('Category Keys:', keys); // Debugging output

    keys.forEach((key) => {
      // console.log(`Category: ${key}`, this.kpiDTOList()[key]); // Debugging output
    });

    return keys;
  }
}
