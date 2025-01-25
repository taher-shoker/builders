import {Component} from '@angular/core';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'stc-apps-deleted-projects-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , RouterModule],
  templateUrl: './deleted-projects-page.component.html',
  styleUrl: './deleted-projects-page.component.scss',
})
export class DeletedProjectsPageComponent {
  
}
