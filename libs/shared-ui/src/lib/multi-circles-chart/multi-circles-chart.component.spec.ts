import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiCirclesChartComponent } from './multi-circles-chart.component';

describe('MultiCirclesChartComponent', () => {
  let component: MultiCirclesChartComponent;
  let fixture: ComponentFixture<MultiCirclesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiCirclesChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiCirclesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
