import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageManagerService } from '@stc-apps/lng-selector';
import { BannerDataService, DialogService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { UsersService, teamsOptions } from '../../users.service';

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
    label: 'jobTitle',
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
  userId!: number;
  privilege!: any[];
  teams!: any[];
  filterSelect!: FormGroup;
  selectedPrivilege = 0;
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
    const searchVal = (event.target as HTMLInputElement).value;

    this.dataSource.filter = searchVal.trim().toLowerCase();
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
      // array without ADMINS Item
      x.pop();
      this.privilege = x;
    });
  }
  getTeams() {
    this.userService.getTeams().subscribe((res) => {
      this.teams = res;
    });
  }
  handleSelectChange(value: any, dropDwonType: string) {
    if (dropDwonType === 'team') {
      if (value.id === 'all') {
        if (this.selectedPrivilege !== 0) {
          this.dataSource.data = this.list.filter(
            (x: any) => x.userGroups[0].id == this.selectedPrivilege
          );
        } else {
          this.dataSource.data = this.list;
        }
      } else {
        this.dataSource.data = this.list.filter(
          (x: any) => x.teamDto?.id == value?.id
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
        this.selectedPrivilege = value.id;
        if (value.id === 1) {
          this.teams = teamsOptions.filter((t: any) => t.id !== 4);
        } else {
          this.teams = teamsOptions.filter((t: any) => t.id === 4);
        }
        this.dataSource.data = this.list.filter(
          (x: any) => x.userGroups[0].id == value?.id
        );
      }
    }
  }
  ngOnInit() {
    this.getUsersListing();
    this.filterSelect = new FormGroup({
      teamSelect: new FormControl(''),
    });
    this.getRoles();
    this.getTeams();

    this.dataSource.paginator = this.paginator;
    this.bannerDataService.updateData({ title: 'users_setting', text: '' });

    this.dataSource.filterPredicate = function (record, filter) {
      return (
        record.name.toLocaleLowerCase().indexOf(filter) != -1 ||
        record.email.toLocaleLowerCase().indexOf(filter) != -1
      );
    };
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
