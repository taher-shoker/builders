import { ComponentFixture, TestBed } from '@angular/core/testing';
import { A2TapComponent } from './a2-tap.component';

describe('A2TapComponent', () => {
  let component: A2TapComponent;
  let fixture: ComponentFixture<A2TapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [A2TapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(A2TapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
