import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationalScorecardComponent } from './operational-scorecard.component';

describe('OperationalScorecardComponent', () => {
  let component: OperationalScorecardComponent;
  let fixture: ComponentFixture<OperationalScorecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalScorecardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationalScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
