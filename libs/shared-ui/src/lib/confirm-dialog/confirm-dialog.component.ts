import { Component, input } from '@angular/core';
@Component({
  selector: 'stc-apps-confirm-dialog',
  standalone: false,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  key = input.required<string>()
}
