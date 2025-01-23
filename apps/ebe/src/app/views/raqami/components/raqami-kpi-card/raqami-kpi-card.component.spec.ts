import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaqamiKpiCardComponent } from './raqami-kpi-card.component';

describe('RaqamiKpiCardComponent', () => {
  let component: RaqamiKpiCardComponent;
  let fixture: ComponentFixture<RaqamiKpiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaqamiKpiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RaqamiKpiCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
