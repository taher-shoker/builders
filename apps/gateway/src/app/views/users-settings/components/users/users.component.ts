import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { User, UserGroup, UsersService } from '../../users.service';
import * as _ from 'lodash';

export interface ColumnsSchema {
  key: string;
  type: string;
  label: string;
}

export interface PeriodicElement {
  id?: number;
  name: string;
  email: string;
  userGroups: {
    id: number;
    groupName: string;
    roles: { id: number; roleName: string }[];
  }[];
  teamDto: { id: number; name: string };
  profileIcon: string;
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
  dataSource = new MatTableDataSource<PeriodicElement>();
  dataSourceFilters = new MatTableDataSource<PeriodicElement>();

  filterDictionary = new Map<string, string>();

  totalUsers = 0;
  creatorUsers = 0;
  approverUsers = 0;
  list!: PeriodicElement[];
  user!: any;
  userId!: number;
  privilege!: any[];
  teams!: any[];
  selectedPrivilege!: { id: any; groupName: string };
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
    this.userService.getUsers().subscribe((res: any) => {
      this.list = res.filter(
        (l: any) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.dataSource.data = res.filter(
        (l: any) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.dataSourceFilters.data = res.filter(
        (l: any) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
      );
      this.totalUsers = res.filter(
        (l: any) => l.userGroups[0].roles[0].roleName !== 'ADMINS'
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

  handleSelectChange(value: any, dropDwonType: string) {
    if (dropDwonType === 'team') {
      if (value.id === 'all') {
        this.dataSource.data = this.list;
      } else {
        this.dataSource.data = this.list.filter(
          (x: any) => this.userService.getUserTeam(x) == value?.name
        );
      }
    } else {
      this.filterSelect
        .get('teamSelect')
        ?.setValue({ id: 'all', name: 'All' }, { emitEvent: false });
      if (value.id === 'all') {
        this.dataSource.data = this.list;
        this.getTeams();
      } else {
        this.teams = this.userService
          .getTeams()
          .filter((x: any) => x.roleName == value.groupName);
        // switch (value.groupName) {
        //   case 'CREATORS':
        //     this.teams = this.userService
        //       .getTeams()
        //       .filter((t: any) => t.roleName == 'CREATORS'); //

        //     break;
        //   case 'APPROVERS':
        //     this.teams = this.userService
        //       .getTeams()
        //       .filter((t: any) => t.roleName == 'APPROVERS');
        //     break;
        //   default:

        //     break;
        // }
        this.dataSource.data = this.list.filter(
          (x: any) => this.userService.getUserPrivilege(x) === value?.groupName
        );
      }
    }
  }

  ngOnInit() {
    this.getUsersListing();
    this.filterSelect = new FormGroup({
      teamSelect: new FormControl(''),
      privilegeSelect: new FormControl(''),
    });

    this.userService.getGroups().subscribe((res) => {
      if (res) {
        this.userService.allGroups = res;
        this.getRoles();
        this.getTeams();
      }
    });

    this.dataSource.paginator = this.paginator;
    this.bannerDataService.updateData({ title: 'users setting', text: '' });
    this.dataSource.filterPredicate = function (record, filter) {
      return (
        record.name?.toLocaleLowerCase().indexOf(filter) != -1 ||
        record.email?.toLocaleLowerCase().indexOf(filter) != -1
      );
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  deleteItem(id: number) {
    this.userId = id;
    this.user = this.dataSource.data.filter((u: any) => u.id === id)[0];
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
