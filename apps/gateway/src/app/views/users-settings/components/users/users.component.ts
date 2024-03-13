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

export interface ColumnsSchema {
  key: string;
  type: string;
  label: string;
}

const COLUMNS_SCHEMA = [
  {
    key: 'name',
    type: 'text',
    label: 'Name',
  },

  {
    key: 'userGroups',
    type: 'text',
    label: 'privilege',
  },
  {
    key: 'teamDto',
    type: 'text',
    label: 'team',
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

@Component({
  selector: 'stc-apps-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = COLUMNS_SCHEMA.map((col) => col.key);
  columnsSchema: ColumnsSchema[] = COLUMNS_SCHEMA;
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

  getUsersListing() {
    this.userService.getUsers().subscribe((res) => {
      this.list = res.filter(
        (l) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
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
    this.privilege = this.userService.getRoles();
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

  private handleTeamDropdownChange(value: Team | Role) {
    const isAllSelected = value.id.toString() === 'all';
    if (isAllSelected) {
      this.handleAllSelectedForTeamDropdown();
    } else {
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        console.log(this.selectedPrivilege);
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
      } else {
        this.dataSource.data = this.list.filter((x) =>
          this.userService.getUserTeam(x).includes((value as Team)?.name)
        );
      }
    }
  }

  private handleAllSelectedForTeamDropdown() {
    if (this.selectedPrivilege.id !== 0) {
      this.dataSource.data = this.list.filter(
        (x) =>
          this.userService.getUserPrivilege(x) ===
          this.selectedPrivilege.groupName
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
      }
    } else {
      this.selectedPrivilege = value as Role; // Assuming 'Role' is a subtype of 'Team'
      if (this.userService.getCurrentSystem() === 'DI_Milestones') {
        if (this.selectedPrivilege.id === 29) {
          this.teams = [];
        } else {
          this.teams = this.userService.getTeams();
        }
      } else {
        this.teams = this.userService
          .getTeams()
          .filter((x) => x.roleName == (value as Role).groupName);
      }

      this.dataSource.data = this.list.filter(
        (x) =>
          this.userService.getUserPrivilege(x) === (value as Role)?.groupName
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
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
    this.userService.deleteUser(this.userId).subscribe((res) => {
      const msgOfToaster =
        this.languageManagerService.getSavedLanguage() == 'ar'
          ? 'تم حذف المستخدم بنجاح'
          : 'User is deleted successfully';

      if (res) {
        this.dialogService.close();
        this.getUsersListing();
        this.toastr.success(msgOfToaster);
      }
    });
  }
}
