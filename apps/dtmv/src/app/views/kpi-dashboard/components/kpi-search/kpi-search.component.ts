import {
  Component,
  EventEmitter,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { KPI } from '../../models/kpi.model';

@Component({
  selector: 'stc-apps-kpi-search',
  templateUrl: './kpi-search.component.html',
  styleUrls: ['./kpi-search.component.scss'],
})
export class KpiSearchComponent implements OnInit, OnDestroy, OnChanges {
  @Output() searchChange = new EventEmitter<string>();
  @Output() dimensionsChange = new EventEmitter<string[]>();
  placeholder = input('KPI name..');
  @Input() kpis: KPI[] = [];

  searchForm = new FormGroup({
    searchControl: new FormControl(''),
    dimensions: new FormControl<string[] | null>(null),
  });
  private destroy$ = new Subject<void>();

  // Dimensions options for multi-select (dynamic)
  dimensionsOptions: { id: string; name: string }[] = [];

  constructor() {
    this.setupSearchDebounce();
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('kpis' in changes) {
      const list = this.kpis || [];
      const baseOrder = [
        'Capability Building',
        'Capability Utilization',
        'Digital Experience & Impact',
      ];
      const present = Array.from(
        new Set(
          list
            .map((k) => (k.description || '').trim())
            .filter((d) => !!d)
        )
      );
      const ordered = baseOrder.filter((d) => present.includes(d));
      this.dimensionsOptions = ordered.map((d) => ({ id: d, name: d }));

      const allIds = this.dimensionsOptions.map((o) => o.id);
      this.searchForm.get('dimensions')?.setValue(allIds, { emitEvent: false });
      this.dimensionsChange.emit(allIds);
    }
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
