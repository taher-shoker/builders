import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyChallengesTableComponent } from './key-challenges-table.component';

describe('KeyChallengesTableComponent', () => {
  let component: KeyChallengesTableComponent;
  let fixture: ComponentFixture<KeyChallengesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyChallengesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyChallengesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
