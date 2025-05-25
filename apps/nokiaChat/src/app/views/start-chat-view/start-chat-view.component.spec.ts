import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StartChatViewComponent } from './start-chat-view.component';

describe('StartChatViewComponent', () => {
  let component: StartChatViewComponent;
  let fixture: ComponentFixture<StartChatViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartChatViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StartChatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
