import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaqamiComponent } from './raqami.component';

describe('RaqamiComponent', () => {
  let component: RaqamiComponent;
  let fixture: ComponentFixture<RaqamiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaqamiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaqamiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
