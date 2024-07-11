import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialScorecardComponent } from './financial-scorecard.component';

describe('FinancialScorecardComponent', () => {
  let component: FinancialScorecardComponent;
  let fixture: ComponentFixture<FinancialScorecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialScorecardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
