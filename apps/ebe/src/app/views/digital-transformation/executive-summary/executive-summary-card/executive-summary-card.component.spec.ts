import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExecutiveSummaryCardComponent } from './executive-summary-card.component';

describe('ExecutiveSummaryCardComponent', () => {
  let component: ExecutiveSummaryCardComponent;
  let fixture: ComponentFixture<ExecutiveSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutiveSummaryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutiveSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
