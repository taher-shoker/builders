import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
type Position =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topleft'
  | 'topright'
  | 'bottomleft'
  | 'bottomright';
@Component({
  selector: 'stc-apps-date-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, CalendarModule, FormsModule],
  templateUrl: './date-modal.component.html',
  styleUrl: './date-modal.component.scss',
})
export class DateModalComponent {
  currentMonth:number = 0;
  currentYear:number = 0;
  currentMonthName: string = '';
  visible: boolean = false;
  position!: Position;
  selectedDate!: Date;
  isSuccess = input<boolean>()
  @Output() filteredDate:EventEmitter<Date> = new EventEmitter();
  months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  ngOnInit() {
    this.selectedDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    this.setDefaultDate(this.selectedDate);
  }
  setDefaultDate(currentDate:Date)
  {
    this.currentMonth = currentDate.getMonth();
    this.currentYear = currentDate.getFullYear();
    this.currentMonthName = this.months[this.currentMonth];
  }
  hideModal()
  {
    console.log(this.isSuccess());
    if(this.isSuccess() === false)
    {
      this.selectedDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      this.setDefaultDate(this.selectedDate);
    }
  }
  showDialog(position: Position) {
    this.position = position;
    this.visible = true;
  }
  applyFilters()
  {
    this.setDefaultDate(this.selectedDate);
    this.visible = false;
    this.filteredDate.emit(this.selectedDate);
  }
}
