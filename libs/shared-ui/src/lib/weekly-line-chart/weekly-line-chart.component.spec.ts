import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyLineChartComponent } from './weekly-line-chart.component';

describe('WeeklyLineChartComponent', () => {
  let component: WeeklyLineChartComponent;
  let fixture: ComponentFixture<WeeklyLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeeklyLineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
