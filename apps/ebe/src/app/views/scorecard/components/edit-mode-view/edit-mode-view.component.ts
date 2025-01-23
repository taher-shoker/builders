import { Component, Output , EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';

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
