import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'stc-apps-api-standard-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
  ],
  templateUrl: './api-standard-filters.component.html',
  styleUrls: ['./api-standard-filters.component.scss'],
})
export class ApiStandardFiltersComponent implements OnInit {
  fb = inject(FormBuilder);
  @Output() filtersChanged = new EventEmitter<any>();
  @Output() sortChanged = new EventEmitter<'asc' | 'desc'>();

  filterForm: FormGroup = new FormGroup({});

  businessAreaOptions = [
    { label: 'Area 1', value: 'Area 1' },
    { label: 'Area 2', value: 'Area 2' },
    { label: 'Area 3', value: 'Area 3' },
  ];

  sortOptions = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
  ];

  selectedSortOption: { label: string; value: string } | null = null;

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
      publishUpdate: [null],
      lastUpdate: [null],
      businessArea: [''],
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((filters) => {
        this.filtersChanged.emit(filters);
      });
  }

  onSort(direction: 'asc' | 'desc') {
    this.sortChanged.emit(direction);
  }
}
