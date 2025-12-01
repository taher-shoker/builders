import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { finalize } from 'rxjs/operators';
import { ActionLogEntry, ActionLogService } from './action-log.service';

@Component({
  selector: 'stc-apps-action-log',
  templateUrl: './action-log.component.html',
  styleUrls: ['./action-log.component.scss'],
})
export class ActionLogComponent implements OnInit {
  form!: FormGroup;
  actions: ActionLogEntry[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;
  loadingTable = false;
  loadingApplyFilters = false;
  loadingExport = false;

  userOptions: { name: string; email: string }[] = [];
  actionTypeOptions: { name: string }[] = [];

  columnsSchema = [
    { key: 'id', type: 'text', label: 'ID' },
    { key: 'createdAt', type: 'date', label: 'Created At' },
    { key: 'createdBy', type: 'text', label: 'Created By' },
    { key: 'resourceId', type: 'text', label: 'Resource ID' },
    { key: 'resourceType', type: 'text', label: 'Resource Type' },
    { key: 'action', type: 'text', label: 'Action' },
    { key: 'system', type: 'text', label: 'System' },
    { key: 'actions', type: 'actions', label: '', actions: ['details'] },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private actionLogService: ActionLogService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      user: [''],
      actionType: [''],
      milestoneName: [''],
    });

    this.actionLogService.getUsers().subscribe((users) => {
      this.userOptions = users || [];
    });
    this.actionLogService.getActionTypes().subscribe((types) => {
      this.actionTypeOptions = types || [];
    });

    this.fetchActions();
  }

  fetchActions(): void {
    const { user, actionType, milestoneName } = this.form.value;
    this.loadingTable = true;
    this.actionLogService
      .getActions({
        page: this.currentPage,
        size: this.pageSize,
        user,
        action: actionType,
        milestoneName,
      })
      .pipe(
        finalize(() => {
          this.loadingTable = false;
          if (this.loadingApplyFilters) this.loadingApplyFilters = false;
        })
      )
      .subscribe((res) => {
        if (Array.isArray(res)) {
          this.actions = res;
          this.totalCount = res.length;
        } else {
          const items = res?.content || res?.items || [];
          const total = res?.totalElements ?? res?.total ?? items.length;
          this.actions = items;
          this.totalCount = total;
        }
      });
  }

  handleFilterChange(): void {
    this.currentPage = 1;
    this.loadingApplyFilters = true;
    this.fetchActions();
  }

  export(): void {
    const { user, actionType, milestoneName } = this.form.value;
    this.loadingExport = true;
    this.actionLogService
      .exportActions({ user, action: actionType, milestoneName })
      .pipe(
        finalize(() => {
          this.loadingExport = false;
        })
      )
      .subscribe((blob) => {
        saveAs(blob, 'action-log.csv');
      });
  }

  paginate(event: { currentPage: number }): void {
    this.currentPage = event.currentPage;
    this.fetchActions();
  }

  setPageItemsCount(size: number): void {
    this.pageSize = Number(size) || 10;
    this.currentPage = 1;
    this.fetchActions();
  }

  onAction(event: { value: string; dataRow: ActionLogEntry }): void {
    if (event.value === 'details') {
      const id = event.dataRow.resourceId;
      this.router.navigate(['../home/milestone_details', id], {
        relativeTo: this.route,
      });
    }
  }

  hasActiveFilters(): boolean {
    const { user, actionType, milestoneName } = this.form?.value || {};
    return Boolean(
      (user && user !== '') ||
        (actionType && actionType !== '') ||
        (milestoneName && String(milestoneName).trim() !== '')
    );
  }
}
