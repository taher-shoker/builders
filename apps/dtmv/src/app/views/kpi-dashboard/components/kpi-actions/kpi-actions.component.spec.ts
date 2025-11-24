import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiActionsComponent } from './kpi-actions.component';

describe('KpiActionsComponent', () => {
  let component: KpiActionsComponent;
  let fixture: ComponentFixture<KpiActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiActionsComponent]
    });
    fixture = TestBed.createComponent(KpiActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
