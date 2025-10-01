import {
  Component,
  EventEmitter,
  input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'stc-apps-kpi-search',
  templateUrl: './kpi-search.component.html',
  styleUrls: ['./kpi-search.component.scss'],
})
export class KpiSearchComponent implements OnDestroy {
  @Output() searchChange = new EventEmitter<string>();
  placeholder = input('Search KPIs...');

  searchForm = new FormGroup({
    searchControl: new FormControl(''),
  });
  private destroy$ = new Subject<void>();

  constructor() {
    this.setupSearchDebounce();
  }

 private setupSearchDebounce(): void {
    this.searchForm.get('searchControl')?.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.searchChange.emit(value || '');
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
