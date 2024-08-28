import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  input,
  InputSignal,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { KpiDTO, Section } from '../../../models/SectorKpisDetails.model';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'stc-apps-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrl: './expansion-panel.component.scss',
})
export class ExpansionPanelComponent {
  kpi: InputSignal<KpiDTO> = input({} as KpiDTO);
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  panelOpenState = false;
  newTabSelected: InputSignal<string> = input('');
  constructor(private cookieService:CookieService) {
    effect(() => {
      if (this.newTabSelected() !== '') {
        console.log('called', this.newTabSelected());
        this.cookieService.set('selectedTab', this.newTabSelected(), {
          expires: 7,
          path: '/',
        });
        this.closeAllPanels();
      }
    });
  }

  // getCategoryKeys(): string[] {
  //   const keys = Object.keys(this.kpiDTOList());
  //   // console.log('Category Keys:', keys); // Debugging output

  //   keys.forEach((key) => {
  //     // console.log(`Category: ${key}`, this.kpiDTOList()[key]); // Debugging output
  //   });
  //   console.log('keys', keys);
  //   return keys;
  // }

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
          { label: 'Weight:', value: Number(kpi.weight) },
          { label: 'Unit:', value: kpi.unit },
        ],
      },
      {
        section: 'right',
        items: [
          { label: 'Actual perf%:', value: kpi.actualPerf },
          { label: 'Applied perf%:', value: kpi.appliedPerf },
        ],
      },
    ];
  }
  closeAllPanels() {
    this.panels?.forEach((panel) => panel.close());
  }
}
