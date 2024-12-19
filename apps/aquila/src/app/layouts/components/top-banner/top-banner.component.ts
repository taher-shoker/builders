import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'stc-apps-top-banner',
  standalone: true,
  imports: [CommonModule, SharedUiModule, ButtonModule],
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss'],
})
export class TopBannerComponent {
  logoSrc = input('');
  userName = 'Sara Alkurdy';
}
