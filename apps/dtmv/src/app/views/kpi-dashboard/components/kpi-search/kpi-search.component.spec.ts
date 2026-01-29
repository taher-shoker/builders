import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiSearchComponent } from './kpi-search.component';

describe('KpiSearchComponent', () => {
  let component: KpiSearchComponent;
  let fixture: ComponentFixture<KpiSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KpiSearchComponent]
    });
    fixture = TestBed.createComponent(KpiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
