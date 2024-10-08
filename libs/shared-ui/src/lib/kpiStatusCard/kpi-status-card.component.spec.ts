import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiStatusCardComponent } from './kpi-status-card.component';

describe('KpiStatusCardComponent', () => {
  let component: KpiStatusCardComponent;
  let fixture: ComponentFixture<KpiStatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiStatusCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiStatusCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
