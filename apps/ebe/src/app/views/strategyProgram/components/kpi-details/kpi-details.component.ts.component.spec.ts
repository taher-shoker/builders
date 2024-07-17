import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpiDetailsComponentTsComponent } from './kpi-details.component.ts.component';

describe('KpiDetailsComponentTsComponent', () => {
  let component: KpiDetailsComponentTsComponent;
  let fixture: ComponentFixture<KpiDetailsComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KpiDetailsComponentTsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpiDetailsComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
