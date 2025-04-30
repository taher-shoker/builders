import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatInsightCardComponent } from './chat-insight-card.component';

describe('ChatInsightCardComponent', () => {
  let component: ChatInsightCardComponent;
  let fixture: ComponentFixture<ChatInsightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatInsightCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatInsightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
