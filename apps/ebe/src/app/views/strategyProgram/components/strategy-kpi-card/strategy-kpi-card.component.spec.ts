import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategyKpiCardComponent } from './strategy-kpi-card.component';

describe('StrategyKpiCardComponent', () => {
  let component: StrategyKpiCardComponent;
  let fixture: ComponentFixture<StrategyKpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyKpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategyKpiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
