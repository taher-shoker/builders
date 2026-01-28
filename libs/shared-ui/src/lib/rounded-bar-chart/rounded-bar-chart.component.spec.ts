import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoundedBarChartComponent } from './rounded-bar-chart.component';

describe('RoundedBarChartComponent', () => {
  let component: RoundedBarChartComponent;
  let fixture: ComponentFixture<RoundedBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundedBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoundedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
