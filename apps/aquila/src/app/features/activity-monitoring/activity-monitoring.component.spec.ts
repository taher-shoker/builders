import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMonitoringComponent } from './activity-monitoring.component';

describe('ActivityMonitoringComponent', () => {
  let component: ActivityMonitoringComponent;
  let fixture: ComponentFixture<ActivityMonitoringComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ActivityMonitoringComponent]
    });
    fixture = TestBed.createComponent(ActivityMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
