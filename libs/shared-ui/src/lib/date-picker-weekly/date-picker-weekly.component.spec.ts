import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePickerWeeklyComponent } from './date-picker-weekly.component';

describe('DatePickerWeeklyComponent', () => {
  let component: DatePickerWeeklyComponent;
  let fixture: ComponentFixture<DatePickerWeeklyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerWeeklyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerWeeklyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
