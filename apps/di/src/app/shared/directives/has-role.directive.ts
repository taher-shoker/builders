/* eslint-disable @angular-eslint/directive-selector */

import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/role.model';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective {
  authService = inject(AuthService);

  @Input() set hasRole(role: string) {
    // Show the content

    if (this.isAuthenticated(role, this.authService.userRoles)){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainerRef.clear();
    }

  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef
  ) {}

  isAuthenticated(roleName: string, roles: UserRole[]): boolean {
    console.log('The role name passed', roleName);

    for (const role of roles) {
      if (role.roleName === roleName || role.roleName === 'ALL') {
        return true;
      }
    }
    return false;
  }
}
