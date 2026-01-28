import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadarBubbleChartComponent } from './radar-bubble-chart.component';

describe('RadarBubbleChartComponent', () => {
  let component: RadarBubbleChartComponent;
  let fixture: ComponentFixture<RadarBubbleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarBubbleChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadarBubbleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
