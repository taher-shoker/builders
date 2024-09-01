import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';

import { LanguageManagerService } from '@stc-apps/lng-selector';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import {
  User,
  Team,
  Role,
  UserGroup,
} from '../../../../shared/models/users-settings.model';
import { UsersService } from '../../users.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PaginationEvent } from 'libs/shared-ui/src/lib/paginator/paginator.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ColumnsSchema } from 'libs/shared-ui/src/lib/custom-table/custom-table.component';

@Component({
  selector: 'stc-apps-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  tableData!: any;
  reportsTotalCount!: number;
  filterString = '';
  columnsSchema!: ColumnsSchema[];

  //  columnsSchema: { key: string; type: string; label: string }[];

  // tableAction(event: { value: string; dataRow: any }) {
  //   if (event.value === 'edit') {
  //     this.router.navigate(['./edit_report', event.dataRow.id], {
  //       relativeTo: this.route,
  //     });
  //   } else if (event.value === 'delete') {
  //     this.makeSureToDelete(event.dataRow.milestoneName).subscribe((res) => {
  //       if (!res) {
  //         return;
  //       }
  //       this.reportsService.deleteMilestone(event.dataRow.id).subscribe({
  //         next: () => {
  //           this.toastr.success('Deleted successfully');
  //           this.getReports();
  //         },
  //         error: () => {
  //           this.toastr.error('Something went wrong!');
  //         },
  //       });
  //     });
  //   } else if (event.value === 'details') {
  //     this.detailsNavigate(event.dataRow);
  //   } else if (event.value === 'updateProgress') {
  //     this.openProgressUpdateModal(event.dataRow);
  //   }
  // }

  // paginate(paginationEvent: PaginationEvent) {
  //   const filteredForm = this.utilities.filterObject(this.form.value);
  //   this.reportsService
  //     .getReports({
  //       page: paginationEvent.currentPage - 1,
  //       ...filteredForm,
  //     })
  //     .pipe(take(1))
  //     .subscribe((res: any) => {
  //       this.populateReports(res);
  //     });
  // }
  ngAfterViewInit(): void {
    this.columnsSchema = [
      {
        key: 'name',
        type: 'text',
        label: 'Name',
      },

      {
        key: 'userGroups',
        type: 'text',
        label:
          this.userService.getCurrentSystem() !== 'Score_Card_Report_DB'
            ? 'privilege'
            : 'roles',
      },
      {
        key: 'teamDto',
        type: 'text',
        label:
          this.userService.getCurrentSystem() !== 'Score_Card_Report_DB'
            ? 'team'
            : 'sectors',
      },
      {
        key: 'jobTitle',
        type: 'text',
        label: 'job Title',
      },
      {
        key: 'actions',
        type: 'actions',
        label: '',
      },
    ];

    // Ensure columnsSchema is not undefined before using map
    this.displayedColumns = (this.columnsSchema ?? []).map((col) => col.key);

    // Assign columnsSchema to columnssSchema if needed
    this.columnssSchema = this.columnsSchema;
    if (
      this.userService.getCurrentSystem() === 'Dynamic_Report_Flow' ||
      this.userService.getCurrentSystem() === 'Business_Excellence_Dashboard'
    ) {
      // this.columnssSchema = th;
      this.displayedColumns = (this.columnsSchema ?? [])
        .filter((c) => c.label !== 'team')
        .map((c) => c.key);
    }
  }

  displayedColumns: string[] | undefined;
  columnssSchema: ColumnsSchema[] | undefined;
  dataSource = new MatTableDataSource<User>();
  dataSourceFilters = new MatTableDataSource<User>();

  filterDictionary = new Map<string, string>();

  totalUsers = 0;
  creatorUsers = 0;
  approverUsers = 0;
  list!: User[];
  user: User | undefined;
  userId!: number;
  privilege!: Role[];
  teams!: Team[];
  selectedPrivilege!: Role;
  selectedTeam!: { id: number; name: string };
  filterSelect!: FormGroup;
  isDeleteLoader = false;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public userService: UsersService,
    private bannerDataService: BannerDataService,
    protected dialogService: DialogService,
    private languageManagerService: LanguageManagerService,
    private toastr: ToastrService
  ) {}

  addUserNavigate(): void {
    this.router.navigate(['./add-user'], { relativeTo: this.route });
  }

  // Fetch the user list from the service
  getUsersListing() {
    this.userService.getUsers().subscribe((res) => {
      this.list = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.tableData = this.list;

      this.dataSource.data = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.dataSourceFilters.data = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.totalUsers = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      ).length;

      this.getCreatorUsersLength(res);
      this.getApproverUsersLength(res);
    });
  }

  searchFilter(event: Event) {
    const searchVal = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchVal.trim().toLowerCase();
  }
  // Count the number of users with 'CREATORS' role
  getCreatorUsersLength(users: User[]) {
    const sys = this.userService.getCurrentSystem();
    const list: UserGroup[] = [];
    _.forEach(users, function (value) {
      _.forEach(value.userGroups, function (group) {
        group.roles[0].system.name === sys &&
          group.roles[0].roleName === 'CREATORS' &&
          list.push(group);
      });
    });
    this.creatorUsers = list.length;
  }

  // Count the number of users with 'APPROVERS' role
  getApproverUsersLength(users: User[]) {
    const sys = this.userService.getCurrentSystem();
    const list: UserGroup[] = [];
    _.forEach(users, function (value) {
      _.forEach(value.userGroups, function (group) {
        group.roles[0].system.name === sys &&
          group.roles[0].roleName === 'APPROVERS' &&
          list.push(group);
      });
    });
    this.approverUsers = list.length;
  }

  getRoles() {
    this.privilege = this.userService
      .getRoles()
      .filter(
        (r) =>
          r.groupName !== 'DT_VP_Dashboard_Viewer' &&
          r.groupName !== 'DT_VP_Dashboard_Editor' &&
          r.groupName !== 'PMO'
      );
    if (
      this.userService.getCurrentSystem() === 'Dynamic_Report_Flow' ||
      this.userService.getCurrentSystem() === 'Business_Excellence_Dashboard' ||
      this.userService.getCurrentSystem() === 'Score_Card_Report_DB'
    ) {
      this.privilege = this.userService.allGroups
        .filter(
          (item: UserGroup) =>
            item.roles &&
            item.roles.length > 0 &&
            item.roles[0].roleName !== 'ADMINS'
        )
        .map((item: UserGroup) => ({
          id: item.roles[0].id,
          groupName: item.roles[0].roleName,
        }));
    }
  }

  getTeams() {
    this.teams = this.userService.getTeams();
  }

  /** filters functions for dropDown  **/
  handleSelectChange(value: Team | Role, dropDownType: string) {
    if (dropDownType === 'team') {
      this.handleTeamDropdownChange(value);
    } else {
      this.handleRoleDropdownChange(value);
    }
  }

  // Handle the team dropdown change
  private handleTeamDropdownChange(value: Team | Role) {
    const isAllSelected = value.id.toString() === 'all';
    if (isAllSelected) {
      this.handleAllSelectedForTeamDropdown();
    } else {
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        if (this.selectedPrivilege.id !== 0) {
          this.dataSource.data = this.list
            .filter((x) =>
              this.userService.getUserTeam(x).includes((value as Team)?.name)
            )
            .filter((x) =>
              this.userService
                .getUserPrivilege(x)
                .includes((this.selectedPrivilege as Role)?.groupName)
            );
        } else {
          this.dataSource.data = this.list.filter((x) =>
            this.userService.getUserTeam(x).includes((value as Team)?.name)
          );
        }
      } else if (
        this.userService.getCurrentSystem() === 'Score_Card_Report_DB'
      ) {
        if (this.selectedPrivilege && this.selectedPrivilege.id !== 0) {
          this.dataSource.data = this.list
            .filter((x) =>
              this.userService.getUserTeam(x).includes((value as Team)?.name)
            )
            .filter((x) =>
              this.userService
                .getUserPrivilege(x)
                .includes((this.selectedPrivilege as Role)?.groupName)
            );
        } else {
          this.dataSource.data = this.list.filter((x) =>
            this.userService.getUserTeam(x).includes((value as Team)?.name)
          );
        }
      } else {
        this.dataSource.data = this.list.filter((x) =>
          this.userService.getUserTeam(x).includes((value as Team)?.name)
        );
      }
    }
  }

  private handleAllSelectedForTeamDropdown() {
    if (
      this.selectedPrivilege !== undefined &&
      this.selectedPrivilege.id !== 0
    ) {
      this.dataSource.data = this.list.filter((x) =>
        this.userService
          .getUserPrivilege(x)
          .includes(this.selectedPrivilege.groupName)
      );
    } else {
      this.dataSource.data = this.list;
    }
  }

  private handleRoleDropdownChange(value: Team | Role) {
    const teamSelectControl = this.filterSelect?.get('teamSelect');
    teamSelectControl?.setValue(
      { id: 'all', name: 'All' },
      { emitEvent: false }
    );

    const isAllSelected = value.id.toString() === 'all';

    if (isAllSelected) {
      this.dataSource.data = this.list;
      this.getTeams();
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        this.selectedPrivilege = { id: 0, groupName: 'all' };
      } else {
        this.selectedPrivilege = { id: 0, groupName: 'all' };
      }
    } else {
      this.selectedPrivilege = value as Role; // Assuming 'Role' is a subtype of 'Team'
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        if (this.selectedPrivilege.groupName === 'DT_Director') {
          this.teams = [];
        } else {
          this.teams = this.userService.getTeams();
        }
      } else if (
        this.userService.getCurrentSystem() === 'Score_Card_Report_DB'
      ) {
        this.teams = this.userService.getTeams();
      } else {
        this.teams = this.userService
          .getTeams()
          .filter((x) => x.roleName == (value as Role).groupName);
      }

      this.dataSource.data = this.list.filter((x) =>
        this.userService
          .getUserPrivilege(x)
          .includes((value as Role)?.groupName)
      );
    }
  }

  ngOnInit() {
    this.getUsersListing();
    this.filterSelect = new FormGroup({
      teamSelect: new FormControl(''),
      privilegeSelect: new FormControl(''),
    });
    this.handleGroups();
    this.handleTeams();

    this.dataSource.paginator = this.paginator;
    this.bannerDataService.updateData({ title: 'Users setting', text: '' });
    this.dataSource.filterPredicate = function (record, filter) {
      return (
        record.name?.toLocaleLowerCase().indexOf(filter) != -1 ||
        record.email?.toLocaleLowerCase().indexOf(filter) != -1
      );
    };
  }
  public handleGroups() {
    this.userService.getGroups().subscribe((res) => {
      if (res) {
        this.userService.allGroups = res;
        this.getRoles();
        this.getTeams();
      }
    });
  }
  public handleTeams() {
    this.userService.getAllTeams().subscribe((res) => {
      if (res) {
        this.userService.allTeams = res;
      }
      if (this.userService.getCurrentSystem() === 'Score_Card_Report_DB') {
        this.getTeams();
      }
    });
  }

  deleteItem(id: number) {
    this.userId = id;
    this.user = this.dataSource.data.filter((u) => u.id === id)[0];
    this.dialogService.open(`delete-modal`);
  }
  editItem(id: number): void {
    this.router.navigate(['./edit-user', id], { relativeTo: this.route });
  }
  confirmDelete() {
    this.isDeleteLoader = true;

    this.userService.deleteUser(this.userId).subscribe({
      next: (res) => {
        if (res) {
          const successMessage =
            this.languageManagerService.getSavedLanguage() === 'ar'
              ? 'تم حذف المستخدم بنجاح'
              : 'User is deleted successfully';

          this.isDeleteLoader = false;
          this.dialogService.close();
          this.getUsersListing();
          this.toastr.success(successMessage);
          this.filterSelect.reset();
        }
      },
      error: (err) => {
        this.isDeleteLoader = false;
        // Handle error case if needed
        //    console.error('Error deleting user:', err);
        // Optionally, display an error message using toastr
      },
    });
  }
}
