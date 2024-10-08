import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiCardHeaderComponent } from './kpi-card-header.component';

describe('KpiCardHeaderComponent', () => {
  let component: KpiCardHeaderComponent;
  let fixture: ComponentFixture<KpiCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpiCardHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
