import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiListHeaderComponent } from './kpi-list-header.component';

describe('KpiListHeaderComponent', () => {
  let component: KpiListHeaderComponent;
  let fixture: ComponentFixture<KpiListHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiListHeaderComponent]
    });
    fixture = TestBed.createComponent(KpiListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
