import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { StatusListComponent } from '../../shared/components/status-list/status-list.component';
import { TableListComponent } from '../../shared/components/table-list/table-list.component';
import { ApiStandard } from '.././../shared/models/standards.models';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { DropdownModule } from 'primeng/dropdown';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'stc-apps-api-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    StatusListComponent,
    InputTextModule,
    TableListComponent,
    InputGroupModule,
    InputGroupAddonModule,
    DropdownModule,
    SplitButtonModule,
  ],
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent {
  private fb = inject(FormBuilder);
  apiTestForm: FormGroup = new FormGroup({});
  standards: string[] = ['Standard A', 'Standard B', 'Standard C'];
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
    apiLink: string;
    standard: string;
    standardList: string[];
    hasRun?: boolean;
  }[] = [];

  completedItems: {
    id: number;
    apiLink: string;
    standard: string;
    standardList: string[];
    hasRun?: boolean;
    hasCompleted?: boolean;
  }[] = [];

  tableData: ApiStandard[] = [];

  columnsSchema: ColumnsSchema[] = [
    { key: 'id', type: 'text', label: 'Test ID' },
    { key: 'description', type: 'text', label: 'Test Description' },
    { key: 'result', type: 'text', label: 'Result' },
    { key: 'recommendation', type: 'text', label: 'Recommendation' },
  ];

  displayedColumns: string[] = this.columnsSchema.map((col) => col.key);

  constructor() {
    this.apiTestForm = this.fb.group({
      apiLink: ['', Validators.required],
      standard: ['', Validators.required],
    });
  }

  sendToQueue(): void {
    const apiLink = this.apiTestForm.get('apiLink')?.value;
    const standard = this.apiTestForm.get('standard')?.value;

    if (apiLink && standard) {
      this.queueItems.push({
        id: this.generateId(),
        standardList: this.standards,
        ...this.apiTestForm.value,
      });
      this.apiTestForm.reset({
        standard: '',
      });
    }
  }

  sendToQueueAndRun() {
    const apiLink = this.apiTestForm.get('apiLink')?.value;
    const standard = this.apiTestForm.get('standard')?.value;

    if (apiLink && standard) {
      const newItem = {
        id: this.generateId(),
        standardList: this.standards,
        ...this.apiTestForm.value,
        hasRun: true,
      };

      this.queueItems = this.queueItems.map((item) => ({
        ...item,
        hasRun: true,
      }));

      this.queueItems.push(newItem);

      setTimeout(() => {
        this.queueItems.forEach((item) => {
          this.completedItems.push({
            ...item,
            hasCompleted: true,
          });
        });
        this.queueItems = [];
      }, 3000);

      this.apiTestForm.reset({
        standard: '',
      });
    }
  }

  private generateId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  onItemsChange(
    updatedItems: {
      id: number;
      apiLink: string;
      standard: string;
      standardList: string[];
      hasRun?: boolean;
      hasCompleted?: boolean;
    }[]
  ): void {
    const finishedItems = updatedItems
      .filter((item) => item.hasRun)
      .map((item) => ({
        id: item.id,
        apiLink: item.apiLink,
        standard: item.standard,
        standardList: [item.standard],
        hasRun: true,
      }));
    this.queueItems = finishedItems;
  }

  onQueueItemSelect(item: any): void {
    this.apiTestForm.patchValue({
      standard: item.standard,
    });
  }

  onCompletedItemsChange(completedItems: any[]) {
    this.completedItems = [...this.completedItems, ...completedItems];
  }

  onCompletedItemClick(item: any): void {
    const updatedData: any[] = [
      {
        id: item.id,
        description: `API Link: ${item.apiLink}, Standard: ${item.standard}`,
        result: 'Sample Result',
        recommendation: 'Sample Recommendation',
      },
    ];
    this.tableData = updatedData;
  }

  onStandardChange(event: { value: any; index: number }) {
    this.queueItems[event.index].standard = event.value;
  }

  downloadFile(path: string, fileName: string) {
    const link = document.createElement('a');
    link.href = path;
    link.download = fileName;
    link.click();
  }
}
