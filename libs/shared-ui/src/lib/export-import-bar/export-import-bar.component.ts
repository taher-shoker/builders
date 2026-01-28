import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'stc-apps-export-import-bar',
  standalone: false,
  templateUrl: './export-import-bar.component.html',
  styleUrls: ['./export-import-bar.component.scss'],
})
export class ExportImportBarComponent {
  @Input() showExport = false;
  @Input() showImport = true;
  @Input() exportLabel = 'Export';
  @Input() importLabel = 'Import';
  @Input() importIconClass = 'pi pi-upload';
  @Input() exportIconClass = 'pi pi-download';

  @Output() import: EventEmitter<void> = new EventEmitter<void>();
  @Output() export: EventEmitter<void> = new EventEmitter<void>();

  onImport() {
    this.import.emit();
  }

  onExport() {
    this.export.emit();
  }
}

