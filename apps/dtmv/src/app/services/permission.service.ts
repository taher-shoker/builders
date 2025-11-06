import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

export interface User {
  id: number;
  email: string;
  name: string;
  jobTitle: string;
  roles?: string[];
  teamName?: null | string;
  userGroups: Group[];
}

interface Group {
  id: number;
  groupName: string;
  roles: { id: number; roleName: string }[];
}

export interface Team {
  id: number;
  name: 'Filed Operation' | 'Customer Care' | 'Digital Care' | 'Fraud';
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private cookieService: CookieService) {}

  getUserType(): Group[] {
    const user = JSON.parse(this.cookieService.get('MODERN_SYSTEM_USER') || '');
    return user.userGroups;
  }

  checkIsDirector() {
    if (this.getUserType().find((x) => x.groupName === 'DT_Director')) {
      return true;
    } else {
      return false;
    }
  }

  checkIsGovernance() {
    if (this.getUserType().find((x) => x.groupName === 'DT_Governance')) {
      return true;
    } else {
      return false;
    }
  }

  checkIsAdmin() {
    if (
      this.getUserType().find((x) => x.groupName === 'DI_Milestones_Admins')
    ) {
      return true;
    } else {
      return false;
    }
  }
}
