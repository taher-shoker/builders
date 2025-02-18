import { Component, EventEmitter, input, InputSignal, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageTap } from '../../../../models/homepage-mobile';

@Component({
  selector: 'stc-apps-tab-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-card.component.html',
  styleUrl: './tab-card.component.scss',
})
export class TabCardComponent {
  tabData:InputSignal<HomePageTap> = input.required<HomePageTap>();
  @Output() currentTap:EventEmitter<HomePageTap> = new EventEmitter()
  getCurrentTab()
  {
    this.currentTap.emit(this.tabData());
  }
}
