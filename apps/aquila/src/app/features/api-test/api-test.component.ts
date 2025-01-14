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
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { StandardsService } from '../../shared/services/standards.service';
import { RunTestService } from '../../shared/services/run-test.service';
import { AccordionModule } from 'primeng/accordion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

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

  apiTestForm: FormGroup = this.fb.group({
    apiUrl: ['', Validators.required],
    standardId: ['', Validators.required],
  });
  standardsDropdown: { label: string; value: string }[] = [];
  selectedStandard: any;
  sanitizedUrl: SafeResourceUrl | null = null;
  standards: Standard[] = [];
  standardOptions = this.standards.map((standard) => ({
    label: standard,
    value: standard,
  }));

  exportItems: { icon: string; label: string; command: () => void }[] = [];

  queueItems: {
    id: number;
    apiUrl: string;
    standardId: any;
    standardList: any[];
    domain?: string;
    hasRun?: boolean;
  }[] = [];

  completedItems: {
    id: number;
    apiUrl: string;
    standardId: any;
    standardList: any[];
    hasRun?: boolean;
    hasCompleted?: boolean;
    date?: Date;
    result?: string;
  }[] = [];

  tableData: any[] = [];
  columnsSchema: ColumnsSchema[] = [
    { key: 'id', type: 'text', label: 'Test ID' },
    { key: 'description', type: 'text', label: 'Test Description' },
    { key: 'result', type: 'text', label: 'Result' },
    { key: 'recommendation', type: 'text', label: 'Recommendation' },
  ];

  displayedColumns: string[] = this.columnsSchema.map((col) => col.key);
  displayPageName: string | null = null;
  html!: any;
  selectedItem: any = null;

  ngOnInit(): void {
    this.loadStandards();
  }

  private loadStandards(): void {
    this.standardsService
      .getStandards()
      .then((response) => {
        this.standards = response.standardDtoList;
        this.standardsDropdown = this.standards.map((standard) => ({
          label: `${standard.name} - ${standard.domain} `,
          name: standard.name,
          domain: standard.domain,
          version: standard.version,
          value: standard.standardId,
        }));
      })
      .catch((error) => {
        console.error('Error loading standards:', error);
      });
  }

  sendToQueue(): void {
    const { apiUrl, standardId } = this.apiTestForm.value;

    if (apiUrl && standardId) {
      this.queueItems.unshift({
        id: this.generateId(),
        standardList: this.standardsDropdown,
        ...this.apiTestForm.value,
        standardId: this.selectedStandard,
      });
      this.apiTestForm.reset();
      this.selectedStandard = null;
    }
  }

  sendToQueueAndRun() {
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

      this.apiTestForm.reset();
      this.selectedStandard = null;

      this.queueItems = this.queueItems.map((item) => ({
        ...item,
        hasRun: true,
        hasCompleted: false,
      }));

      this.queueItems.unshift(newItem);

      this.handleRunTestBatch(this.queueItems)
        .then(({ response, items }) => {
          if (!response || !items) return;

          const updatedCompletedItems = items.map((item, index) => {
            const responseItem = response.testResults[index];

            return {
              ...item,
              hasCompleted: true,
              date: new Date(),
              standardList: item.standardList,
              parentTestId: responseItem?.parentTestId,
              result: responseItem?.result ? 'pass' : 'faild',
              summaryFileJson: responseItem?.summaryFileHtml,
              summaryFileHtml: responseItem?.summaryFileHtml,
              standardId: item.standardId,
            };
          });

          this.completedItems = [
            ...updatedCompletedItems,
            ...this.completedItems,
          ];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tests completed successfully',
          });

          this.queueItems = [];
          this.apiTestForm.reset();
          this.selectedStandard = null;
        })
        .catch((error) => {
          console.error('API failed:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to run tests',
          });

          this.queueItems = this.queueItems.map((item) => ({
            ...item,
            hasRun: false,
            hasCompleted: false,
          }));
        });
    }
  }

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  onItemsChange(
    updatedItems: {
      id: number;
      apiUrl: string;
      standardId: any;
      standardList: any[];
      hasRun?: boolean;
    }[]
  ): void {
    const finishedItems = updatedItems
      .filter((item) => item.hasRun)
      .map((item) => ({
        id: item?.id,
        apiUrl: item.apiUrl,
        standardId: {
          label: `${item.standardId?.name} - ${item.standardId?.domain}`,
          name: item.standardId.name,
          domain: item.standardId.domain,
          version: item.standardId.version,
          value: item.standardId.value,
        },
        standardList: item.standardList,
        hasRun: true,
        hasCompleted: false,
      }));

    this.queueItems = finishedItems;

    if (finishedItems.length > 0) {
      this.handleRunTestBatch(finishedItems)
        .then(({ response, items }) => {
          if (!response || !items) return;

          const updatedCompletedItems = items.map((item, index) => {
            const responseItem = response.testResults[index];
            return {
              ...item,
              parentTestId: responseItem?.parentTestId,
              standardList: item.standardList,
              hasCompleted: true,
              date: new Date(),
              result: responseItem?.result ? 'pass' : 'faild',
              summaryFileJson: responseItem?.summaryFileJson,
              summaryFileHtml: responseItem?.summaryFileHtml,
              standardId: item.standardId,
            };
          });

          this.completedItems = [
            ...updatedCompletedItems,
            ...this.completedItems,
          ];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tests completed successfully',
          });

          this.queueItems = [];
          this.apiTestForm.reset();
          this.selectedStandard = null;
        })
        .catch((error) => {
          console.error('API failed:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to run tests',
          });

          this.queueItems = this.queueItems.map((item) => ({
            ...item,
            hasRun: false,
            hasCompleted: false,
            standardId: this.selectedStandard,
          }));
        });
    }
  }

  onRemoveItem(remainingItems: any) {
    this.queueItems = remainingItems;
  }

  handleRunTestBatch(
    items: {
      id: number;
      apiUrl: string;
      standardId: { name: string; version: string; domain: string };
      standardList: any[];
    }[]
  ) {
    const requests: any[] = items.map((item) => ({
      apiUrl: item.apiUrl,
      standardId: item.standardId?.name,
      version: item.standardId?.version,
    }));

    return this.runTestService.runMultipleTests(requests).then((response) => {
      return { response, items };
    });
  }

  onStandardChanged(option: any) {
    this.apiTestForm.patchValue({
      standardId: option,
    });
    this.selectedStandard = option;
  }

  onCompletedItemsChange(completedItems: any[]) {
    this.completedItems = [...this.completedItems, ...completedItems];
  }

  onCompletedItemClick(item: any): void {
    this.selectedItem = item;
    if (item) {
      const updatedData: any[] = [
        {
          id: item.id,
          description: `API Link: ${item.apiUrl}, Standard: ${item.standardId}`,
          result: item.result,
          recommendation: 'Sample Recommendation',
        },
      ];
      this.tableData = updatedData;
      this.updateExportItems(item);
    } else {
      this.tableData = [];
      this.exportItems = [];
    }
  }

  updateExportItems(item: any): void {
    if (!item) {
      this.exportItems = [];
      return;
    }

    this.exportItems = [
      {
        icon: 'pi pi-download',
        label: 'PDF',
        command: () =>
          this.downloadFile(item.summaryFileJson, 'Standard PDF.pdf'),
      },
      {
        icon: 'pi pi-download',
        label: 'HTML',
        command: () =>
          this.downloadFile(item.summaryFileHtml, 'Documentation HTML.html'),
      },
    ];
  }

  getIconClass(result: string): string {
    return result === 'pass' ? 'pi pi-verified' : 'pi pi-times-circle';
  }

  onStandardChange(event: { value: any; index: number }) {
    this.queueItems[event.index].standardId = event.value;
  }

  downloadFile(path: string, fileName: string) {
    const fileExtension = path.slice(path.lastIndexOf('.')).toLowerCase();

    let mimeType: string;

    switch (fileExtension) {
      case '.pdf':
        mimeType = 'application/pdf';
        break;
      case '.html':
        mimeType = 'text/html';
        break;
      default:
        mimeType = 'application/octet-stream';
        break;
    }
    const blob = new Blob([path], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
