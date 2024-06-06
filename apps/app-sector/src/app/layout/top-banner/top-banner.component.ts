import { Component, WritableSignal, signal } from '@angular/core';

@Component({
  selector: 'stc-apps-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss']
})
export class TopBannerComponent {
  milestoneProgress: WritableSignal<number | null> = signal(74.91);

}
