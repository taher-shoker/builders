import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { UserModel } from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { DigitalTransformationService } from '../../services/digital-transformation.service';
import { DigitalTransformationTapModel } from '../../models/digital-transformation';
import { ExecutiveSummaryComponent } from './executive-summary/executive-summary.component';
@Component({
  selector: 'stc-apps-digital-transformation',
  standalone: true,
  imports: [CommonModule, SharedUiModule, ExecutiveSummaryComponent],
  templateUrl: './digital-transformation.component.html',
  styleUrl: './digital-transformation.component.scss',
})
export class DigitalTransformationComponent implements OnInit {
  userData!: UserModel;
  currTap = signal<DigitalTransformationTapModel>(
    {} as DigitalTransformationTapModel
  );
  scorecardService = inject(ScorecardService);
  digitalTransformationService = inject(DigitalTransformationService);
  digitalTransformationTaps: WritableSignal<DigitalTransformationTapModel[]> =
    signal<DigitalTransformationTapModel[]>([]);
  ngOnInit(): void {
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
    this.digitalTransformationTaps.set(
      this.digitalTransformationService.getDigitalTransformationTaps()
    );
    this.currTap.set(this.digitalTransformationTaps()[0]);
  }
  getClickedTap(tap: DigitalTransformationTapModel): void {
    console.log('Clicked tab:', tap);
    this.currTap.set(tap);
  }
}
