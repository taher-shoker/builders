import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiFormDialogComponent } from './kpi-form-dialog.component';

describe('KpiFormDialogComponent', () => {
  let component: KpiFormDialogComponent;
  let fixture: ComponentFixture<KpiFormDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiFormDialogComponent]
    });
    fixture = TestBed.createComponent(KpiFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
