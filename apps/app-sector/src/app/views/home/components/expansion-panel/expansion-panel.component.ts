import { Component, input, InputSignal } from '@angular/core';
import { KpiDTO, Section } from '../../../models/SectorKpisDetails.model';

@Component({
  selector: 'stc-apps-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
})
export class ExpansionPanelComponent {
  kpiDTOList: InputSignal<KpiDTO[] | any> = input([]);

  panelOpenState = false;

  getCategoryKeys(): string[] {
    const keys = Object.keys(this.kpiDTOList());
    // console.log('Category Keys:', keys); // Debugging output

    keys.forEach((key) => {
      // console.log(`Category: ${key}`, this.kpiDTOList()[key]); // Debugging output
    });

    return keys;
  }

  // cards = [
  //   {
  //     projectHeader: 'STC KSA Epit',
  //     kpisCode: 'APS1-2024',
  //     status: 'On track',
  //     direction: 'increasing',
  //     function: 'linear 2X',
  //     percent: 23,
  //   },
  //   {
  //     projectHeader: 'STC KSA Epit',
  //     kpisCode: 'APS1-2023',
  //     status: 'Delayed',
  //     direction: 'increasing',
  //     function: 'linear 2X',
  //     percent: 46,
  //   },
  //   {
  //     projectHeader: 'STC KSA Epit',
  //     kpisCode: 'APS1-2023',
  //     status: 'On track',
  //     direction: 'increasing',
  //     function: 'linear 2X',
  //     percent: 46,
  //   },
  // ];

  generateListItems(kpi: KpiDTO): Section[] {
    return [
      {
        section: 'left',
        items: [
          { label: 'Weight:', value: Number(kpi.weight * 100) },
          { label: 'Unit:', value: Number(kpi.unit) },
        ],
      },
      {
        section: 'right',
        items: [
          { label: 'Actual perf%:', value: kpi.actualPerf * 100 },
          { label: 'Applied perf%:', value: kpi.appliedPerf * 100 },
        ],
      },
    ];
  }
}
