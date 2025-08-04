import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackIssueComponent } from './feedback-issue.component';

describe('FeedbackIssueComponent', () => {
  let component: FeedbackIssueComponent;
  let fixture: ComponentFixture<FeedbackIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackIssueComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
