import {
  Component,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitalTransformationService } from '../../../services/digital-transformation.service';
import {
  AddKeyChallengeDataModel,
  KeyChallengesDataModel,
  KeyChallengesModel,
} from '../../../models/digital-transformation';
import { Subject, takeUntil } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
@Component({
  selector: 'stc-apps-key-challenges-table',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  templateUrl: './key-challenges-table.component.html',
  styleUrl: './key-challenges-table.component.scss',
})
export class KeyChallengesTableComponent
  implements OnInit, OnDestroy, OnChanges
{
  digitalTransformationService = inject(DigitalTransformationService);
  challengesData!: KeyChallengesModel;
  endSubs$: Subject<any> = new Subject();
  isEmpty = false;
  isAsc = true;
  first = 0;
  rows = 5;
  page = 1;
  isChallengeAdded = input<boolean>(false);
  isAdded = new EventEmitter();
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
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
          // console.log(res);
        },
      });
  }
  ngOnInit(): void {
    this.getData(1, 5, this.sortDirection);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChallengeAdded']) {
      this.getData(this.page, 5, this.sortDirection, this.sortedBy);
    }
  }
  sortDirection: 'asc' | 'desc' = 'desc';
  sortedBy = '';
  sort(type: string) {
    this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    if (type === 'id') {
      this.sortedBy = 'challengeId';
    } else {
      this.sortedBy = 'dateRaised';
    }
    this.getData(this.page, 5, this.sortDirection, this.sortedBy);
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 5;
    this.page = event.page ?? 1;
    this.getData(
      (event.page ?? 0) + 1,
      this.rows,
      this.sortDirection,
      this.sortedBy
    );
  }
  // get paginatedChallenges(): KeyChallengesDataModel[] {
  //   const start = this.first;
  //   const end = this.first + this.rows;
  //   console.log(this.challengesData);
  //   return this.challengesData.data?.slice(start, end);
  // }
}
