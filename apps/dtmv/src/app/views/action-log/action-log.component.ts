import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
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
  loadingClearFilters = false;
  loadingExport = false;

  userOptions: { name: string; email: string }[] = [];
  actionTypeOptions: { name: string }[] = [];
  private userLookup: Map<string, string> = new Map<string, string>();
  private lastHasActiveFilters = false;
  dropdownResetKey = 0;

  columnsSchema = [
    {
      key: 'formattedCreatedAt',
      type: 'text',
      label: 'Action Date',
      align: 'left',
    },
    { key: 'createdByName', type: 'text', label: 'User', align: 'left' },
    { key: 'action', type: 'text', label: 'Action Type', align: 'left' },
    { key: 'resourceType', type: 'text', label: 'Module Type', align: 'left' },
    {
      key: 'resourceName',
      type: 'text',
      label: 'Milestone Name',
      align: 'left',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private actionLogService: ActionLogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      user: [''],
      actionType: [''],
      milestoneName: [''],
    });

    this.fetchInitialData();

    this.lastHasActiveFilters = this.hasActiveFilters();
    this.form.valueChanges.subscribe(() => {
      const now = this.hasActiveFilters();
      if (!now && this.lastHasActiveFilters) {
        this.currentPage = 1;
        this.fetchActions();
      }
      this.lastHasActiveFilters = now;
    });
  }

  private fetchInitialData(): void {
    const { user, actionType, milestoneName } = this.form.value;
    this.loadingTable = true;
    forkJoin({
      users: this.actionLogService.getUsers(),
      actionTypes: this.actionLogService.getActionTypes(),
      actions: this.actionLogService.getActions({
        page: this.currentPage,
        size: this.pageSize,
        user,
        action: actionType,
        milestoneName,
      }),
    })
      .pipe(
        finalize(() => {
          this.loadingTable = false;
        })
      )
      .subscribe(({ users, actionTypes, actions }) => {
        this.userOptions = users || [];
        this.userLookup = new Map((users || []).map((u) => [u.email, u.name]));
        this.actionTypeOptions = actionTypes || [];

        if (Array.isArray(actions)) {
          this.actions = this.mapActionItems(actions);
          this.totalCount = actions.length;
        } else {
          const items = actions?.content || actions?.items || [];
          const total =
            actions?.totalElements ?? actions?.total ?? items.length;
          this.actions = this.mapActionItems(items);
          this.totalCount = total;
        }
      });
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
          if (this.loadingClearFilters) this.loadingClearFilters = false;
        })
      )
      .subscribe((res) => {
        if (Array.isArray(res)) {
          this.actions = this.mapActionItems(res);
          this.totalCount = res.length;
        } else {
          const items = res?.content || res?.items || [];
          const total = res?.totalElements ?? res?.total ?? items.length;
          this.actions = this.mapActionItems(items);
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
      .subscribe({
        next: (blob) => {
          const filename = this.buildExportFilename();
          saveAs(blob, filename);
        },
        error: () => {
          this.toastr.error(
            'No action log entries found. Try adjusting your filters or check back later.'
          );
        },
      });
  }

  clearFilters(): void {
    this.loadingClearFilters = true;
    this.form.reset({ user: '', actionType: '', milestoneName: '' });
    this.dropdownResetKey++;
    this.currentPage = 1;
    this.fetchActions();
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

  private formatDateTime(ts: string): string {
    if (!ts) return '-';
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
  }

  private resolveUserName(createdBy: string): string {
    return this.userLookup.get(createdBy) ?? createdBy;
  }

  private mapActionItems(items: ActionLogEntry[]): ActionLogEntry[] {
    return (items || []).map((item) => ({
      ...item,
      formattedCreatedAt: this.formatDateTime(item.createdAt),
      createdByName: this.resolveUserName(item.createdBy),
    }));
  }
  private buildExportFilename(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `action-log_${yyyy}-${mm}-${dd}_${hh}-${mi}-${ss}.xlsx`;
  }
}
