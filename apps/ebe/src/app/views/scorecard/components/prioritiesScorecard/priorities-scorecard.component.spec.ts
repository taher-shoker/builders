import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrioritiesScorecardComponent } from './priorities-scorecard.component';

describe('PrioritiesScorecardComponent', () => {
  let component: PrioritiesScorecardComponent;
  let fixture: ComponentFixture<PrioritiesScorecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrioritiesScorecardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrioritiesScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
