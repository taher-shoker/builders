import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileProjectCardComponent } from './mobile-project-card.component';

describe('MobileProjectCardComponent', () => {
  let component: MobileProjectCardComponent;
  let fixture: ComponentFixture<MobileProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileProjectCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileProjectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
