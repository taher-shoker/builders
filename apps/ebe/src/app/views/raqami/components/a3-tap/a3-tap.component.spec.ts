import { ComponentFixture, TestBed } from '@angular/core/testing';
import { A3TapComponent } from './a3-tap.component';

describe('A3TapComponent', () => {
  let component: A3TapComponent;
  let fixture: ComponentFixture<A3TapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A3TapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(A3TapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
