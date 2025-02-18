import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaqamiTapDetailsComponent } from './raqami-tap-details.component';

describe('RaqamiTapDetailsComponent', () => {
  let component: RaqamiTapDetailsComponent;
  let fixture: ComponentFixture<RaqamiTapDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaqamiTapDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaqamiTapDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
