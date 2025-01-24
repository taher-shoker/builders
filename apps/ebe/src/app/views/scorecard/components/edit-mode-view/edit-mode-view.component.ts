import { Component, Output , EventEmitter, inject, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'stc-apps-edit-mode-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-mode-view.component.html',
  styleUrl: './edit-mode-view.component.scss',
})
export class EditModeViewComponent {
  @Output() import:EventEmitter<boolean> = new EventEmitter();
  @Output() export:EventEmitter<boolean> = new EventEmitter();
  @Output() showActivityLogs:EventEmitter<boolean> = new EventEmitter();
  showActivityLogsButton = input<boolean>(true);
  authService = inject(AuthService);
  // isAdmin = false;
  // ngOnInit()
  // {
  //   this.authService.userRoles.subscribe({
  //     next : (role) => {
  //       this.isAdmin = role.roles.some(
  //         (role) => role.roleName === 'BE_EDITORS' || role.roleName === 'ADMINS'
  //       );
  //     }
  //   })
  // }
  showDialog()
  {
    this.import.emit()
  }
  downloadTemplate()
  {
    this.export.emit()
  }
  activityLogs()
  {
    this.showActivityLogs.emit()
  }
}
