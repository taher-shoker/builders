import {Component, inject} from '@angular/core';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
@Component({
  selector: 'stc-apps-deleted-projects-page',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , RouterModule],
  templateUrl: './deleted-projects-page.component.html',
  styleUrl: './deleted-projects-page.component.scss',
})
export class DeletedProjectsPageComponent {
  route = inject(Router);
  currentUrl:string = '';
  ngOnInit()
  {
    const title = this.route.url.split("/")[2];
    if(title.includes("-"))
    {
      this.currentUrl = title.split("-")[1];
    } else {
      this.currentUrl = title;
    }
  }
}
