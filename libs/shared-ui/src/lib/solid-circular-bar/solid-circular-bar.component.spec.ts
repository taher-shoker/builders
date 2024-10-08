import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolidCircularBarComponent } from './solid-circular-bar.component';

describe('SolidCircularBarComponent', () => {
  let component: SolidCircularBarComponent;
  let fixture: ComponentFixture<SolidCircularBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolidCircularBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolidCircularBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
