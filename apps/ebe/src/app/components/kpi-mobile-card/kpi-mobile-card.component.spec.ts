import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiMobileCardComponent } from './kpi-mobile-card.component';

describe('KpiMobileCardComponent', () => {
  let component: KpiMobileCardComponent;
  let fixture: ComponentFixture<KpiMobileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiMobileCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiMobileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
