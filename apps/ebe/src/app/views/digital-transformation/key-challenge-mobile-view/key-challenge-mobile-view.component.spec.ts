import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyChallengeMobileViewComponent } from './key-challenge-mobile-view.component';

describe('KeyChallengeMobileViewComponent', () => {
  let component: KeyChallengeMobileViewComponent;
  let fixture: ComponentFixture<KeyChallengeMobileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyChallengeMobileViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyChallengeMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
