import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuggestedQuestionComponent } from './suggestedQuestion.component';

describe('SuggestedQuestionComponent', () => {
  let component: SuggestedQuestionComponent;
  let fixture: ComponentFixture<SuggestedQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggestedQuestionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuggestedQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
