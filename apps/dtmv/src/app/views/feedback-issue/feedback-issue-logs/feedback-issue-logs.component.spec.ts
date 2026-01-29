import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackIssueLogsComponent } from './feedback-issue-logs.component';

describe('FeedbackIssueLogsComponent', () => {
  let component: FeedbackIssueLogsComponent;
  let fixture: ComponentFixture<FeedbackIssueLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackIssueLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackIssueLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
