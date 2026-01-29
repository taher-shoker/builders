import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiListSectionComponent } from './kpi-list-section.component';

describe('KpiListSectionComponent', () => {
  let component: KpiListSectionComponent;
  let fixture: ComponentFixture<KpiListSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiListSectionComponent]
    });
    fixture = TestBed.createComponent(KpiListSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
