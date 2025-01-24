import { Component, EventEmitter, input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
@Component({
  selector: 'stc-apps-menu-popup',
  standalone: true,
  imports: [CommonModule,MenuModule],
  templateUrl: './menu-popup.component.html',
  styleUrl: './menu-popup.component.scss',
})
export class MenuPopupComponent {
  menuItems = input.required<any[]>();
  @Output() onClick:EventEmitter<string> = new EventEmitter();
  menuActions(label:string)
  {
    this.onClick.emit(label)
  }
  preventClose(event: any) {
    // Override default behavior to prevent closing
    event.preventDefault();
  }
}
