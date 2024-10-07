import { ComponentFixture, TestBed } from '@angular/core/testing';
import { A1TapComponent } from './a1-tap.component';

describe('A1TapComponent', () => {
  let component: A1TapComponent;
  let fixture: ComponentFixture<A1TapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A1TapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(A1TapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
