import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { EmpFilter, User, UsersService } from '../../users.service';

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
    label: 'privilage',
  },
  {
    key: 'teamDto',
    type: 'text',
    label: 'team',
  },
  // {
  //   key: 'jobeTitle',
  //   type: 'text',
  //   label: 'jobe Title',
  // },
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
  userId!: number;
  privilage = [];
  teams = [];

  empFilters: EmpFilter[] = [];
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
  addNewUserLabel = 'add_new_user';
  addUserNavigate(): void {
    this.router.navigate(['./add-user'], { relativeTo: this.route });
  }

  getUsersListing() {
    this.userService.getUsers().subscribe((res: any) => {
      this.list = res.filter(
        (l: any) => l.userGroups[0].groupName !== 'Admins'
      );
      this.dataSource.data = res.filter(
        (l: any) => l.userGroups[0].groupName !== 'Admins'
      );
      this.dataSourceFilters.data = res.filter(
        (l: any) => l.userGroups[0].groupName !== 'Admins'
      );
      this.totalUsers = res.filter(
        (l: any) => l.userGroups[0].groupName !== 'Admins'
      ).length;

      this.getCreatorUsersLength(res);
      this.getApproverUsersLength(res);
    });
  }
  searchFilter(event: Event) {
    const searchVal = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = searchVal;
  }

  getCreatorUsersLength(arr: any) {
    const list: any[] = [];
    arr.map((currentValue: any, index: any) => {
      if (currentValue.userGroups[0].groupName === 'Creators') {
        list.push(currentValue);
      }
    });
    this.creatorUsers = list.length;
  }

  getApproverUsersLength(arr: any) {
    const list: any[] = [];
    arr.map((currentValue: any, index: any) => {
      if (currentValue.userGroups[0].groupName === 'Approvers') {
        list.push(currentValue);
      }
    });
    this.approverUsers = list.length;
  }
  getRoles() {
    this.userService.getGroups().subscribe((res) => {
      const x = res;
      x.pop();
      x.unshift({ groupName: 'All', id: 'all' });

      this.privilage = x;
    });
  }
  getTeams() {
    this.userService.getTeams().subscribe((res) => {
      const x = res;
      x.unshift({ id: 'all', name: 'All' });
      this.teams = x;
    });
  }
  handleSelectChange(value: string, empfilter: EmpFilter) {
    if (empfilter.name === 'team') {
      this.dataSource.data = this.list.filter(
        (x: any) => x.teamDto?.id == value
      );
    } else {
      this.dataSource.data = this.list.filter(
        (x: any) => x.userGroups[0].id == value
      );
    }
  }
  ngOnInit() {
    this.getUsersListing();

    this.getRoles();
    this.getTeams();
    this.empFilters.push({
      name: 'privilage',
      key: 'userGroups',
      options: this.privilage,
      defaultValue: 'All',
      labelName: 'groupName',
    });
    this.empFilters.push({
      name: 'team',
      key: 'teamDto',
      options: this.teams,
      defaultValue: 'All',
      labelName: 'name',
    });
    this.dataSourceFilters.filterPredicate = function (record, filter) {
      const map = new Map(JSON.parse(filter));
      let isMatch = false;
      for (const [key, value] of map) {
        isMatch = value == 'All' || record[key as keyof User] == value;
        if (!isMatch) return false;
      }
      return isMatch;
    };

    this.dataSource.paginator = this.paginator;
    this.bannerDataService.updateData({ title: 'users_setting', text: '' });
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  deleteItem(id: number) {
    this.userId = id;
    this.dialogService.open(`${id}`);
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
