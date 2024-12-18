import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClusteredColumnChartComponent } from './clustered-column-chart.component';

describe('ClusteredColumnChartComponent', () => {
  let component: ClusteredColumnChartComponent;
  let fixture: ComponentFixture<ClusteredColumnChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClusteredColumnChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClusteredColumnChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
