import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavItem } from './header.model';

@Component({
  selector: 'stc-apps-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() userName: string | undefined;
  @Input() logoSrc: string | undefined;
  @Input() sidebarLogoSrc: string | undefined;
  @Output() logOut: EventEmitter<void> = new EventEmitter();
  @Output() backToHome: EventEmitter<void> = new EventEmitter();

  @Input({ required: true })
  allItems!: NavItem[];
  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;
  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target === this.menu.nativeElement) {
        return;
      }

      if (e.target !== this.toggleButton.nativeElement) {
        this.showMenu = false;
      }
    });
  }

  showMenu = false;
  toggle(): void {
    this.showMenu = !this.showMenu;
  }
  handleLogout() {
    this.logOut.emit();
  }
}
