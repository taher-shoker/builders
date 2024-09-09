import { Component, effect, input, InputSignal } from '@angular/core';
import { KpiDTO } from '../../../models/SectorKpisDetails.model';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'stc-apps-panels-container',
  templateUrl: './panels-container.component.html',
  styleUrl: './panels-container.component.scss',
})
export class PanelsContainerComponent {
  categoryName: InputSignal<string> = input('');
  kpiDTOList: InputSignal<{ [key: string]: { [subkey: string]: KpiDTO[] } }> =
    input({});
  newTabSelected: InputSignal<string> = input('');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private cookieService: CookieService) {
    // effect(() => {
    //   if (this.newTabSelected()) {
    //     this.cookieService.set('selectedTab', this.newTabSelected(), {
    //       expires: 7,
    //       path: '/',
    //     });
    //   }
    // });
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.kpiDTOList() || {});
  }

  getSubKeys(category: string): string[] {
    return Object.keys(this.kpiDTOList()[category] || {});
  }
}
