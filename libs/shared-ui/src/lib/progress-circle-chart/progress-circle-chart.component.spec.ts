import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressCircleChartComponent } from './progress-circle-chart.component';

describe('ProgressCircleChartComponent', () => {
  let component: ProgressCircleChartComponent;
  let fixture: ComponentFixture<ProgressCircleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgressCircleChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressCircleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
