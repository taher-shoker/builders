import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
@Component({
  selector: 'stc-apps-psr-details-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule],
  templateUrl: './psr-details-page.component.html',
  styleUrl: './psr-details-page.component.scss',
})
export class PsrDetailsPageComponent {}
