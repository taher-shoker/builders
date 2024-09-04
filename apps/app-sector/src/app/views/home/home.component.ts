import { Component } from '@angular/core';
import { SectorService } from '../../services/sector.service';

@Component({
  selector: 'stc-apps-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  scoreCardName = this.sectorService.getSectorName() || '';
  constructor(private sectorService: SectorService) {}
}
