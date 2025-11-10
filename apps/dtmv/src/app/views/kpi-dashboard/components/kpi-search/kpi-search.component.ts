import {
  Component,
  EventEmitter,
  input,
  OnDestroy,
  Output,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'stc-apps-kpi-search',
  templateUrl: './kpi-search.component.html',
  styleUrls: ['./kpi-search.component.scss'],
})
export class KpiSearchComponent implements OnInit, OnDestroy {
  @Output() searchChange = new EventEmitter<string>();
  @Output() dimensionsChange = new EventEmitter<string[]>();
  placeholder = input('KPI name..');

  searchForm = new FormGroup({
    searchControl: new FormControl(''),
    dimensions: new FormControl<string[] | null>(null),
  });
  private destroy$ = new Subject<void>();

  // Dimensions options for multi-select
  dimensionsOptions = [
    { id: 'Capability Building', name: 'Capability Building' },
    { id: 'Capability Utilization', name: 'Capability Utilization' },
    { id: 'Digital Experience & Impact', name: 'Digital Experience & Impact' },
  ];

  constructor() {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {
    // Preselect all dimensions except the 'All' placeholder
    const allIdsExceptAll = this.dimensionsOptions
      .map((o) => o.id);
    this.searchForm.get('dimensions')?.setValue(allIdsExceptAll, {
      emitEvent: false,
    });
    this.dimensionsChange.emit(allIdsExceptAll);
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

  onDimensionsChange(values: string[] | string): void {
    // Ensure output is always an array of selected ids
    const selected = Array.isArray(values) ? values : [values];
    // If 'All' is selected, replace with all item ids except 'All'
    if (selected.includes('All')) {
      const allIdsExceptAll = this.dimensionsOptions
        .filter((o) => o.id !== 'All')
        .map((o) => o.id);
      this.searchForm.get('dimensions')?.setValue(allIdsExceptAll, {
        emitEvent: false,
      });
      this.dimensionsChange.emit(allIdsExceptAll);
      return;
    }
    this.dimensionsChange.emit(selected);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
