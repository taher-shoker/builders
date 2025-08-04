import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackIssueCardComponent } from './feedback-issue-card.component';

describe('FeedbackIssueCardComponent', () => {
  let component: FeedbackIssueCardComponent;
  let fixture: ComponentFixture<FeedbackIssueCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FeedbackIssueCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackIssueCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
