import { Component, Input, input, InputSignal } from '@angular/core';
import { userSector } from '../../models/userSector.model';
import { Router } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SectorService } from 'apps/app-sector/src/app/services/sector.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { YearQuarterService } from 'apps/app-sector/src/app/services/yearQuarter.service';

@Component({
  selector: 'stc-apps-user-score-cards',
  templateUrl: './user-scoreCards.component.html',
  styleUrl: './user-scoreCards.component.scss',
})
export class UserScoreCardsComponent {
  constructor(
    private router: Router,
    private sectorService: SectorService,
    private YearQuarterService: YearQuarterService
  ) {}
  showItemDesc = false;
  hoverIndex = -1;
  @Input() sectors: userSector[] = [];
  onHover(i: number) {
    this.hoverIndex = i;
    if (i == -1) {
      this.showItemDesc = false;
    } else {
      this.showItemDesc = true;
    }
  }
  navigate(title: string, id: number) {
    this.sectorService.setSectorName(title);
    this.YearQuarterService.clearYearQuarter();
    this.router.navigate(['/sectors',title]);
  }
}
