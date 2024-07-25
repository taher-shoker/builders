import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XYChartComponent } from './XY-chart.component';

describe('XYChartComponent', () => {
  let component: XYChartComponent;
  let fixture: ComponentFixture<XYChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XYChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(XYChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
