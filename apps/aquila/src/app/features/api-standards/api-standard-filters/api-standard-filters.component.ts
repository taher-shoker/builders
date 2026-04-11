import {
  Component,
  EventEmitter,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { debounceTime } from 'rxjs';
import { SharedUiModule } from '@stc-apps/shared-ui';

export interface StandardFiltersFormValue {
  name: string;
  publishUpdate: Date | null;
  lastUpdate: Date | null;
  businessArea: string | null;
}

@Component({
  selector: 'stc-apps-api-standard-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    SharedUiModule,
  ],
  templateUrl: './api-standard-filters.component.html',
  styleUrls: ['./api-standard-filters.component.scss'],
})
export class ApiStandardFiltersComponent implements OnInit {
  businessAreaOptions: InputSignal<{ label: string; value: any }[]> = input<
    { label: string; value: any }[]
  >([]);
  @Output() filtersChanged = new EventEmitter<StandardFiltersFormValue>();
  @Output() sortChanged = new EventEmitter<{
    label: string;
    value: 'asc' | 'desc';
  }>();

  filterForm: FormGroup = new FormGroup({});
  fb = inject(FormBuilder);

  sortOptions = [
    { label: 'Ascending', value: 'asc' },
    { label: 'Descending', value: 'desc' },
  ];

  selectedSortOption: {
    label: string;
    value: 'asc' | 'desc';
  } | null = null;

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      name: [''],
      publishUpdate: [null],
      lastUpdate: [null],
      businessArea: [null],
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe((filters) => {
        this.filtersChanged.emit(filters);
      });
  }

  onSortChange(value: { label: string; value: 'asc' | 'desc' }): void {
    this.selectedSortOption = value;
    this.sortChanged.emit(value);
  }

  onBusinessAreaChange(selectedItem: any): void {
    if (selectedItem && selectedItem.value) {
      this.filterForm.get('businessArea')?.setValue(selectedItem.value);
    } else {
      this.filterForm.get('businessArea')?.setValue(null);
    }
  }
}
