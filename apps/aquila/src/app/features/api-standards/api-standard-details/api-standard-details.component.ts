import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { Router } from '@angular/router';
import { BreadcrumbsComponent } from '../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'stc-apps-api-standard-details',
  standalone: true,
  imports: [CommonModule, SharedUiModule, BreadcrumbsComponent],
  templateUrl: './api-standard-details.component.html',
  styleUrls: ['./api-standard-details.component.scss'],
})
export class ApiStandardDetailsComponent implements OnInit {
  private router = inject(Router);
  details: WritableSignal<any> = signal<any>({});
  exportItems = [
    {
      label: 'Standard PDF',
      icon: 'pi pi-download',
      command: () => this.downloadFile('/path/to/standard.pdf', 'Standard PDF'),
    },
    {
      label: 'CTK script',
      icon: 'pi pi-download',
      command: () => this.downloadFile('/path/to/ctk-script.js', 'CTK script'),
    },
    {
      label: 'Swagger',
      icon: 'pi pi-download',
      command: () => this.downloadFile('/path/to/swagger.json', 'Swagger'),
    },
  ];

  ngOnInit(): void {
    if (history.state && history.state.standard) {
      const standardData = history.state.standard;
      this.details.set(standardData);
    }
  }

  downloadFile(path: string, fileName: string) {
    const link = document.createElement('a');
    link.href = path;
    link.download = fileName;
    link.click();
  }

  onEdit(item: any) {
    this.router.navigate([`/api-standard-list/edit-standard`], {
      state: { standard: item, isEditMode: true },
    });
  }

  openApiSpecifications() {
    window.open('https://www.tmforum.org/oda/open-apis/directory', '_blank');
  }
}
