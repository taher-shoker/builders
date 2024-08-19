import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiCirclesProgressBarComponent } from './multi-circles-progress-bar.component';

describe('MultiCirclesProgressBarComponent', () => {
  let component: MultiCirclesProgressBarComponent;
  let fixture: ComponentFixture<MultiCirclesProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiCirclesProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiCirclesProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
