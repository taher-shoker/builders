import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripleLineChartComponent } from './triple-line-chart.component';

describe('TripleLineChartComponent', () => {
  let component: TripleLineChartComponent;
  let fixture: ComponentFixture<TripleLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripleLineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TripleLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
