import { Component, Input, input, InputSignal } from '@angular/core';
import { userSector } from '../../models/userSector.model';
import { Router } from '@angular/router';

@Component({
  selector: 'stc-apps-user-score-cards',
  templateUrl: './user-scoreCards.component.html',
  styleUrl: './user-scoreCards.component.scss',
})
export class UserScoreCardsComponent {
  constructor(private router: Router) {}
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
    this.router.navigate(['/'], {
      state: { scoreCardName: title },
    });
  }
}
