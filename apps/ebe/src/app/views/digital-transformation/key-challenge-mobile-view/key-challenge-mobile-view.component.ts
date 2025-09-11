import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalTransformationService } from '../../../services/digital-transformation.service';
import { Subject, takeUntil } from 'rxjs';
import { KeyChallengesModel } from '../../../models/digital-transformation';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
@Component({
  selector: 'stc-apps-key-challenge-mobile-view',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, PaginatorModule],
  templateUrl: './key-challenge-mobile-view.component.html',
  styleUrl: './key-challenge-mobile-view.component.scss',
})
export class KeyChallengeMobileViewComponent implements OnInit, OnDestroy {
  isEmpty!: boolean;
  endSubs$: Subject<any> = new Subject();
  @ViewChild('overlayPanel2') overlayPanel2?: OverlayPanel;
  digitalTransformationService = inject(DigitalTransformationService);
  challengesData!: KeyChallengesModel;
  private getData(
    pageNum: number,
    pageSize: number,
    sort?: string,
    sortBy?: string
  ) {
    this.isEmpty = false;
    this.digitalTransformationService
      .getKeyChallengrsData(pageNum, pageSize, sort, sortBy)
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: KeyChallengesModel) => {
          this.challengesData = res;
          if (this.challengesData.data.length === 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        },
      });
  }
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  ngOnInit(): void {
    this.getData(1, 5);
  }
  first = 0;
  rows = 5;
  page = 1;
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.page = (event.page ?? 0) + 1;

    this.getData((event.page ?? 0) + 1, this.rows);
  }
}
