import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiAttributesListComponent } from './kpi-attributes-list.component';

describe('KpiAttributesListComponent', () => {
  let component: KpiAttributesListComponent;
  let fixture: ComponentFixture<KpiAttributesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiAttributesListComponent]
    });
    fixture = TestBed.createComponent(KpiAttributesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
