import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenderingStatusChartComponent } from './tendering-status-chart.component';

describe('TenderingStatusChartComponent', () => {
  let component: TenderingStatusChartComponent;
  let fixture: ComponentFixture<TenderingStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenderingStatusChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenderingStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
