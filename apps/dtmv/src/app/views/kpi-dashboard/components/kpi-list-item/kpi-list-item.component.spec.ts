import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiListItemComponent } from './kpi-list-item.component';

describe('KpiListItemComponent', () => {
  let component: KpiListItemComponent;
  let fixture: ComponentFixture<KpiListItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiListItemComponent]
    });
    fixture = TestBed.createComponent(KpiListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
