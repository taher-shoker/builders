import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserScoreCardsComponent } from './user-scoreCards.component';

describe('UserScoreCardsComponent', () => {
  let component: UserScoreCardsComponent;
  let fixture: ComponentFixture<UserScoreCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserScoreCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserScoreCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
