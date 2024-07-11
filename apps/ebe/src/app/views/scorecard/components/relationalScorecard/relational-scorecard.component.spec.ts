import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RelationalScorecardComponent } from './relational-scorecard.component';

describe('RelationalScorecardComponent', () => {
  let component: RelationalScorecardComponent;
  let fixture: ComponentFixture<RelationalScorecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelationalScorecardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RelationalScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
