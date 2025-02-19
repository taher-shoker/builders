import { Component, effect, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
interface MenuItems
{
  label:string;
  icon:string;
}
@Component({
  selector: 'stc-apps-menu-popup',
  standalone: true,
  imports: [CommonModule,MenuModule , OverlayPanelModule],
  templateUrl: './menu-popup.component.html',
  styleUrl: './menu-popup.component.scss',
})
export class MenuPopupComponent {
  @ViewChild('actionsPanel') actionsPanel!: OverlayPanel;
  menuItems = input.required<MenuItems[]>();
  hidePopup = input.required<boolean>();
  @Output() onClick:EventEmitter<string> = new EventEmitter();
  @Output() hide:EventEmitter<any> = new EventEmitter();
  hidePanel()
  {
    this.hide.emit();
  }
  menuActions(label:string)
  {
    this.onClick.emit(label)
  }
  constructor(){
    effect(() => {
      if(!this.hidePopup())
      {
        this.actionsPanel.hide();
      }
    })
  }
  preventClose(event: any) {
    // Override default behavior to prevent closing
    event.preventDefault();
  }
}
