import {
  Component,
  EventEmitter,
  input,
  InputSignal,
  Output,
} from '@angular/core';
import suggestedQuestions from '../../views/chat-view/models/chatModel';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'stc-apps-suggested-question',
  templateUrl: './suggestedQuestion.component.html',
  styleUrl: './suggestedQuestion.component.scss',
  animations: [
    trigger('questionAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          height: '0px',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          height: '*',
        })
      ),
      transition('hidden <=> visible', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class SuggestedQuestionComponent {
  hideQuestion: InputSignal<boolean> = input(false);
  @Output() sendQuestionEvent = new EventEmitter<string>();
  questions = suggestedQuestions;
  constructor() {
    console.log(this.questions);
  }
  sendQuestion(question: string) {
    this.sendQuestionEvent.emit(question);
  }
}
