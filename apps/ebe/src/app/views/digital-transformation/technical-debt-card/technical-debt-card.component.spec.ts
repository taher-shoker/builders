import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TechnicalDebtCardComponent } from './technical-debt-card.component';

describe('TechnicalDebtCardComponent', () => {
  let component: TechnicalDebtCardComponent;
  let fixture: ComponentFixture<TechnicalDebtCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalDebtCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalDebtCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
