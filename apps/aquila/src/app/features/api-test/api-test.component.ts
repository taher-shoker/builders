import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StatusListComponent } from '../../shared/components/status-list/status-list.component';
import { Standard } from '.././../shared/models/standards.models';
import { QueueItem } from '.././../shared/models/run-test.models';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { StandardsService } from '../../shared/services/standards.service';
import { RunTestService } from '../../shared/services/run-test.service';
import { AccordionModule } from 'primeng/accordion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { catchError, firstValueFrom, of } from 'rxjs';
import { environment } from '../../../environments/environment.stage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'stc-apps-api-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    StatusListComponent,
    InputTextModule,
    FormsModule,
    AccordionModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit {
  private standardsService = inject(StandardsService);
  private runTestService = inject(RunTestService);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private http = inject(HttpClient);

  apiTestForm: FormGroup = this.fb.group({
    apiUrl: ['', Validators.required],
    standardId: ['', Validators.required],
  });
  standardsDropdown: { label: string; value: string }[] = [];
  selectedStandard: Standard | null = null;
  sanitizedUrls: Map<string, SafeResourceUrl> = new Map();
  standards: Standard[] = [];
  standardOptions = this.standards.map((standard) => ({
    label: standard,
    value: standard,
  }));

  exportItems: { icon: string; label: string; command: () => void }[] = [];
  queueItems: QueueItem[] = [];
  completedItems: QueueItem[] = [];

  tableData: any[] = [];
  columnsSchema: ColumnsSchema[] = [
    { key: 'id', type: 'text', label: 'Test ID' },
    { key: 'description', type: 'text', label: 'Test Description' },
    { key: 'result', type: 'text', label: 'Result' },
    { key: 'recommendation', type: 'text', label: 'Recommendation' },
  ];

  displayedColumns: string[] = this.columnsSchema.map((col) => col.key);
  displayPageName: string | null = null;
  selectedItem: any | null = null;

  ngOnInit(): void {
    this.loadStandards();
  }

  private loadStandards(): void {
    this.standardsService
      .getStandards()
      .pipe(
        catchError((error) => {
          console.error('Error loading standards:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.standards = response.standardDtoList;
          this.standardsDropdown = this.standards.map((standard) => ({
            label: `${standard.name} - ${standard.domain} `,
            name: standard.name,
            domain: standard.domain,
            version: standard.version,
            value: standard.standardId,
          }));
        }
      });
  }

  private resetForm(): void {
    this.apiTestForm.reset();
  }

  private handleTestCompletion(response: any, items: QueueItem[]): void {
    const updatedCompletedItems = items.map((item, index) => {
      const responseItem = response.testResults[index];
      // const result = responseItem?.parentTestId != null ? 'pass' : 'failed';
      let result;
      if (responseItem.totalFails > 0) {
        result = 'failed';
      } else {
        result = responseItem?.parentTestId != null ? 'pass' : 'failed';
      }
      return {
        ...item,
        hasCompleted: true,
        date: new Date(),
        standardList: item.standardList,
        parentTestId: responseItem?.parentTestId,
        result: result,
        summaryFileJson: responseItem?.summaryFileJson
          ? `${environment.apiUrl}${responseItem.summaryFileJson}`
          : '',
        summaryFileHtml: responseItem?.summaryFileHtml
          ? `${environment.apiUrl}${responseItem.summaryFileHtml}`
          : '',
        standardId: item?.standardId,
      };
    });

    this.completedItems = [...updatedCompletedItems, ...this.completedItems];
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Tests completed successfully',
    });

    this.queueItems = [];
    this.resetForm();
    this.selectedStandard = null;
  }

  private handleTestError(error: any): void {
    console.error('API failed:', error.message);
    let errorMessage = 'Failed to run tests';

    if (error.error && error.error.errorMessage) {
      errorMessage = error.error.errorMessage;
    }
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
    });

    this.queueItems = this.queueItems.map((item) => ({
      ...item,
      hasRun: false,
      hasCompleted: false,
    }));
  }

  sendToQueue(): void {
    const { apiUrl, standardId } = this.apiTestForm.value;

    if (apiUrl && standardId) {
      const newItem = {
        id: this.generateId(),
        standardList: this.standardsDropdown,
        ...this.apiTestForm.value,
        standardId: this.selectedStandard,
        hasRun: false,
        hasCompleted: false,
      };
      this.queueItems.unshift(newItem);
      this.resetForm();
      this.selectedStandard = null;
    }
  }

  async sendToQueueAndRun() {
    const { apiUrl, standardId } = this.apiTestForm.value;

    if (apiUrl && standardId) {
      const newItem = {
        id: this.generateId(),
        standardList: this.standardsDropdown,
        ...this.apiTestForm.value,
        standardId: this.selectedStandard,
        hasRun: true,
        hasCompleted: false,
      };

      this.queueItems.unshift(newItem);

      const itemsToRun = [
        newItem,
        ...this.queueItems.slice(1).map((item) => ({
          ...item,
          hasRun: true,
          hasCompleted: false,
        })),
      ];

      try {
        const response = await firstValueFrom(
          this.handleRunTestBatch(itemsToRun)
        );
        if (response) {
          this.handleTestCompletion(response, itemsToRun);
        }
      } catch (error) {
        this.handleTestError(error);
      }

      this.resetForm();
      this.selectedStandard = null;
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    if (!this.sanitizedUrls.has(url)) {
      const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.sanitizedUrls.set(url, safeUrl);
      return safeUrl;
    }

    return this.sanitizedUrls.get(url) as SafeResourceUrl;
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  async onItemsChange(updatedItems: QueueItem[]): Promise<void> {
    const itemsToRun = updatedItems.map((item) => ({
      ...item,
      hasRun: true,
      hasCompleted: false,
      standardId: item.standardId || this.selectedStandard,
    }));

    if (itemsToRun.length > 0) {
      this.queueItems = itemsToRun;

      try {
        const response = await firstValueFrom(
          this.handleRunTestBatch(itemsToRun)
        );
        if (response) {
          this.handleTestCompletion(response, itemsToRun);
        }
      } catch (error) {
        this.handleTestError(error);
      }
    }
  }

  onRemoveItem(remainingItems: QueueItem[]) {
    this.queueItems = remainingItems;
  }

  handleRunTestBatch(items: QueueItem[]) {
    const requests = items.map((item) => ({
      apiUrl: item.apiUrl,
      standardId: item.standardId?.name || '',
      version: item.standardId?.version || '',
    }));

    return this.runTestService.runMultipleTests(requests).pipe(
      catchError((error) => {
        throw error;
      })
    );
  }

  onStandardChanged(option: Standard) {
    this.apiTestForm.patchValue({
      standardId: option,
    });
    this.selectedStandard = option;
  }

  onCompletedItemsChange(completedItems: QueueItem[]) {
    this.completedItems = [...this.completedItems, ...completedItems];
  }

  onCompletedItemClick(item: QueueItem): void {
    this.selectedItem = item;
    if (item) {
      this.tableData = [
        {
          id: item.id,
          description: `API Link: ${item.apiUrl}, Standard: ${item.standardId}`,
          result: item.result,
          recommendation: 'Sample Recommendation',
        },
      ];
      this.updateExportItems(item);
    } else {
      this.tableData = [];
      this.exportItems = [];
    }
  }

  updateExportItems(item: QueueItem): void {
    if (!item) {
      this.exportItems = [];
      return;
    }

    this.exportItems = [
      {
        icon: 'pi pi-download',
        label: 'JSON',
        command: () => {
          if (item.summaryFileJson) {
            this.downloadFile(item.summaryFileJson, 'summary.json');
          }
        },
      },
      {
        icon: 'pi pi-download',
        label: 'HTML',
        command: () => {
          if (item.summaryFileHtml) {
            this.downloadFile(item.summaryFileHtml, 'summary.html');
          }
        },
      },
    ];
  }

  getIconClass(result: string): string {
    return result === 'pass' ? 'pi pi-verified' : 'pi pi-times-circle';
  }

  onStandardChange(event: { value: Standard; index: number }) {
    this.queueItems[event.index].standardId = event.value;
  }

  async downloadFile(url: string, fileName: string) {
    try {
      const response = await firstValueFrom(
        this.http.get(url, { responseType: 'blob' })
      );
      const blob = new Blob([response], { type: this.getMimeType(fileName) });
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = downloadUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to download file',
      });
    }
  }

  private getMimeType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      html: 'text/html',
      json: 'application/json',
    };
    return mimeTypes[extension || ''] || 'application/octet-stream';
  }
}
