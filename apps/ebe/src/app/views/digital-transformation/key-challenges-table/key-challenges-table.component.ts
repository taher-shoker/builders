import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalTransformationService } from '../../../services/digital-transformation.service';
import { KeyChallengesModel } from '../../../models/digital-transformation';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'stc-apps-key-challenges-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './key-challenges-table.component.html',
  styleUrl: './key-challenges-table.component.scss',
})
export class KeyChallengesTableComponent implements OnInit, OnDestroy {
  digitalTransformationService = inject(DigitalTransformationService);
  challengesData: KeyChallengesModel[] = [];
  endSubs$: Subject<any> = new Subject();
  isEmpty = false;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  ngOnInit(): void {
    this.isEmpty = false;
    this.digitalTransformationService
      .getKeyChallengrsData()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: KeyChallengesModel[]) => {
          this.challengesData = res;
          if (this.challengesData.length === 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
          // console.log(res);
        },
      });
  }
}
