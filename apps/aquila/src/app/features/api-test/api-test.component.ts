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
import { map } from 'rxjs';
import { AccordionModule } from 'primeng/accordion';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  ],
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent implements OnInit {
  private standardsService = inject(StandardsService);
  private runTestService = inject(RunTestService);
  private sanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);

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
  exportItems = [
    {
      icon: 'pi pi-download',
      label: 'Standard PDF',
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
      };

      this.queueItems = this.queueItems.map((item) => ({
        ...item,
        hasRun: true,
      }));

      this.queueItems.unshift(newItem);
      setTimeout(() => {
        this.handleRunTestBatch(this.queueItems).subscribe({
          next: (response) => {
            console.log(`Test completed successfully:`, response);
          },
          error: (err) => {
            console.error(`Error during test execution:`, err);
          },
          complete: () => {
            console.log('All tests processed.');
            this.queueItems = [];
          },
        });

        this.queueItems.forEach((item) => {
          this.completedItems.unshift({
            ...item,
            hasCompleted: true,
            date: new Date(),
            result: 'pass',
          });
        });

        this.queueItems = [];
        this.apiTestForm.reset();
        this.selectedStandard = null;
      }, 3000);
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  onItemsChange(
    updatedItems: {
      id: number;
      apiUrl: string;
      standardId: { name: string; version: string; domain: string };
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
          label: `${item.standardId?.name} - ${item.standardId?.domain} - ${item.standardId?.version} `,
          name: item.standardId.name,
          version: item.standardId.version,
          domain: item.standardId.domain,
        },
        standardList: this.standardsDropdown,
        hasRun: true,
      }));
    this.queueItems = finishedItems;

    if (finishedItems.length > 0) {
      this.handleRunTestBatch(finishedItems).subscribe({
        next: ({ items }) => {},
      });
    }
  }

  onRemoveItem(remainingItems: any) {
    console.log(remainingItems);
    this.queueItems = remainingItems;
  }

  handleRunTestBatch(
    items: {
      id: number;
      apiUrl: string;
      standardId: { name: string; version: string; domain: string };
    }[]
  ) {
    const requests: any[] = items.map((item) => ({
      apiUrl: item.apiUrl,
      standardId: item.standardId?.name,
      version: item.standardId?.version,
    }));

    console.log(requests);

    return this.runTestService.runMultipleTests(requests).pipe(
      map((response) => ({
        response,
        items,
      }))
    );
  }

  onStandardChanged(option: any) {
    console.log(option);
    this.apiTestForm.patchValue({
      standardId: option,
    });
    this.selectedStandard = option;
  }

  onCompletedItemsChange(completedItems: any[]) {
    this.completedItems = [...this.completedItems, ...completedItems];
  }

  onCompletedItemClick(item: any): void {
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

      this.html = this.sanitizer.bypassSecurityTrustResourceUrl(
        'http://qeemanet-my.sharepoint.com/personal/mohamed_amin_qeema_net/_layouts/15/embed.aspx?UniqueId=85611aea-5caf-4461-92b4-91fb05934f2b'
      );
    } else {
      this.tableData = [];
    }
  }

  getIconClass(result: string): string {
    return result === 'pass' ? 'pi pi-verified' : 'pi pi-times-circle';
  }

  onStandardChange(event: { value: any; index: number }) {
    this.queueItems[event.index].standardId = event.value;
  }

  downloadFile(path: string, fileName: string) {
    const link = document.createElement('a');
    link.href = path;
    link.download = fileName;
    link.click();
  }
}
