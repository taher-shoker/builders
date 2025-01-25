import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityLogsPopupComponent } from './activity-logs-popup.component';

describe('ActivityLogsPopupComponent', () => {
  let component: ActivityLogsPopupComponent;
  let fixture: ComponentFixture<ActivityLogsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
