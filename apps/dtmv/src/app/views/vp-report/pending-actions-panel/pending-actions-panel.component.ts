import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stc-apps-vp-pending-actions',
  templateUrl: './pending-actions-panel.component.html',
  styleUrls: ['./pending-actions-panel.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ right: '20px' })),
      state('out', style({ right: '-600px' })),
      transition('out => in', [animate('300ms ease-in')]),
      transition('in => out', [animate('300ms ease-out')]),
    ]),
  ],
  standalone: false,
})
export class PendingActionsPanelComponent {
  @Input() caption = 'Pending actions';
  @Input() items: any[] = [];
  @Input() closable = false;
  @Input() isOpen = true;

  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() closeClicked: EventEmitter<void> = new EventEmitter<void>();

  get panelState(): 'in' | 'out' {
    return this.isOpen ? 'in' : 'out';
  }

  onItemClicked(item: any) {
    this.itemClicked.emit(item);
  }

  onCloseClicked() {
    this.isOpen = false;
    this.closeClicked.emit();
  }
}
