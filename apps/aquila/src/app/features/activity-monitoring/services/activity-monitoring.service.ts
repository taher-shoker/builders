import { inject, Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment.stage';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ActivityApiResponse, ActivityFilters } from '../models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityMonitoringService implements OnDestroy {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/Activities`;
  private readonly http = inject(HttpClient);

  private filterSubject = new BehaviorSubject<ActivityFilters>({});
  private paginationSubject = new BehaviorSubject<{
    pageNumber: number;
    pageSize: number;
  }>({
    pageNumber: 1,
    pageSize: 10,
  });
  private destroy$ = new Subject<void>();

  readonly activities$ = combineLatest([
    this.filterSubject.pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    ),
    this.paginationSubject.pipe(
      distinctUntilChanged(
        (prev, curr) =>
          prev.pageNumber === curr.pageNumber && prev.pageSize === curr.pageSize
      )
    ),
  ]).pipe(
    debounceTime(300),
    switchMap(([filters, pagination]) =>
      this.getActivities(filters, pagination.pageNumber, pagination.pageSize)
    ),
    takeUntil(this.destroy$)
  );

  constructor() {
    this.triggerInitialLoad();
  }

  private triggerInitialLoad() {
    this.filterSubject.next({});
  }

  updateFilters(filters: ActivityFilters) {
    this.filterSubject.next(filters);
  }

  updatePagination(pageNumber: number, pageSize: number): void {
    this.paginationSubject.next({ pageNumber, pageSize });
  }

  private getActivities(
    filters: ActivityFilters,
    pageNumber: number,
    pageSize: number
  ): Observable<ActivityApiResponse> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.post<ActivityApiResponse>(
      this.apiUrl,
      this.processFilters(filters),
      {
        params,
      }
    );
  }

  private processFilters(filters: ActivityFilters): Partial<ActivityFilters> {
    const body = { ...filters };

    if (body.startedAt instanceof Date) {
      body.startedAt = this.formatDateToLocalISO(body.startedAt);
    }

    return Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== '' && value != null)
    ) as Partial<ActivityFilters>;
  }

  private formatDateToLocalISO(date: Date): string {
    const formatNumber = (num: number, digits: number) =>
      num.toString().padStart(digits, '0');

    const year = date.getFullYear();
    const month = formatNumber(date.getMonth() + 1, 2);
    const day = formatNumber(date.getDate(), 2);
    const hours = formatNumber(date.getHours(), 2);
    const minutes = formatNumber(date.getMinutes(), 2);
    const seconds = formatNumber(date.getSeconds(), 2);
    const milliseconds = formatNumber(date.getMilliseconds(), 3);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
