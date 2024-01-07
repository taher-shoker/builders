import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpisTrendComponent } from './kpis-trend.component';

describe('KpisTrendComponent', () => {
  let component: KpisTrendComponent;
  let fixture: ComponentFixture<KpisTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpisTrendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpisTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
