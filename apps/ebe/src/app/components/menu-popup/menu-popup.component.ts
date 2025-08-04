import {
  Component,
  effect,
  EventEmitter,
  input,
  Output,
  ViewChild,
} from '@angular/core';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
interface MenuItems {
  label: string;
  icon: string;
}
@Component({
  selector: 'stc-apps-menu-popup',
  standalone: true,
  imports: [OverlayPanelModule],
  templateUrl: './menu-popup.component.html',
  styleUrl: './menu-popup.component.scss',
})
export class MenuPopupComponent {
  @ViewChild('actionsPanel') actionsPanel!: OverlayPanel;
  menuItems = input.required<MenuItems[]>();
  hidePopup = input.required<boolean>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClick: EventEmitter<string> = new EventEmitter();
  @Output() hide: EventEmitter<any> = new EventEmitter();
  hidePanel() {
    this.hide.emit();
  }
  menuActions(label: string) {
    this.onClick.emit(label);
  }
  constructor() {
    effect(() => {
      if (!this.hidePopup()) {
        this.actionsPanel.hide();
      }
    });
  }
  preventClose(event: any) {
    // Override default behavior to prevent closing
    event.preventDefault();
  }
}
