import { Component, Input, input, InputSignal } from '@angular/core';
import { userSector } from '../../models/userSector.model';
import { Router } from '@angular/router';
import { SectorService } from 'apps/app-sector/src/app/services/sector.service';

@Component({
  selector: 'stc-apps-user-score-cards',
  templateUrl: './user-scoreCards.component.html',
  styleUrl: './user-scoreCards.component.scss',
})
export class UserScoreCardsComponent {
  constructor(private router: Router, private sectorService: SectorService) {}
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
  navigate(title: string) {
    this.sectorService.setSectorName(title);
    this.router.navigate(['/home']);
  }
}
