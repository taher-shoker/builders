import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuarterAchievementsComponent } from './quarter-achievements.component';

describe('QuarterAchievementsComponent', () => {
  let component: QuarterAchievementsComponent;
  let fixture: ComponentFixture<QuarterAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuarterAchievementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuarterAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
