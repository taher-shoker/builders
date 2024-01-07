import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerWeeklyRangeComponent } from './date-picker-weekly-range.component';

describe('DatePickerWeeklyRangeComponent', () => {
  let component: DatePickerWeeklyRangeComponent;
  let fixture: ComponentFixture<DatePickerWeeklyRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerWeeklyRangeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerWeeklyRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
