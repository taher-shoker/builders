import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMonitoringFiltersComponent } from './activity-monitoring-filters.component';

describe('ActivityMonitoringFiltersComponent', () => {
  let component: ActivityMonitoringFiltersComponent;
  let fixture: ComponentFixture<ActivityMonitoringFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActivityMonitoringFiltersComponent]
    });
    fixture = TestBed.createComponent(ActivityMonitoringFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
