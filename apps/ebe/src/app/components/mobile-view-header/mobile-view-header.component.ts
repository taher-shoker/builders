import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateModalComponent } from '../date-modal/date-modal.component';
import { Router } from '@angular/router';
@Component({
  selector: 'stc-apps-mobile-view-header',
  standalone: true,
  imports: [CommonModule , DateModalComponent],
  templateUrl: './mobile-view-header.component.html',
  styleUrl: './mobile-view-header.component.scss',
})
export class MobileViewHeaderComponent {
  isSuccess = input.required<boolean>();
  showDateModal = input<boolean>();
  headerTitle = input.required<string>()
  router = inject(Router);
  @Output() applyFilters:EventEmitter<Date> = new EventEmitter()
  goBack()
  {
    this.router.navigateByUrl("/");
  }
  applyDateFilterInMobileView(e:Date)
  {
    this.applyFilters.emit(e);
  }
}
