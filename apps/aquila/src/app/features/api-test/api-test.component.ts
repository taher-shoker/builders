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
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TableListComponent } from '../../shared/components/table-list/table-list.component';
import { ApiStandard } from '.././../shared/models/standards.models';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

@Component({
  selector: 'stc-apps-api-test',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedUiModule,
    StatusListComponent,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TableListComponent,
  ],
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent {
  private fb = inject(FormBuilder);
  apiTestForm: FormGroup = new FormGroup({});
  standards: string[] = ['Standard A', 'Standard B', 'Standard C'];
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
}
