import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategicScorecardComponent } from './strategic-scorecard.component';

describe('StrategicScorecardComponent', () => {
  let component: StrategicScorecardComponent;
  let fixture: ComponentFixture<StrategicScorecardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicScorecardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategicScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
