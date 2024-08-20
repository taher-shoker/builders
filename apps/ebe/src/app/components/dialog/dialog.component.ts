import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FileUploadInputComponent } from '../file-upload-input/file-upload-input.component';
import { FileModel } from '../../models/scorecard.model';

@Component({
  selector: 'stc-apps-dialog-modal',
  standalone: true,
  imports: [CommonModule , DialogModule, FileUploadInputComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogModalComponent {
  @Input({required : true}) visible!:boolean;
  @Output() ImportedFile:EventEmitter<FileModel> = new EventEmitter();
  @Output() onhide:EventEmitter<boolean> = new EventEmitter();
  selectedFile!:FileModel | null;
  isHidden!:boolean;
  hideDialog()
  {
    this.isHidden = true;
    this.onhide.emit(true);
  }
  showDialog2()
  {
    this.isHidden = false;
  }
  getUploadedFile(e:FileModel | null) {
    this.selectedFile = e;
  }
  importData()
  {
    if(this.selectedFile)
    {
      this.ImportedFile.emit(this.selectedFile);
      // this.getScorecardsTaps()
    }
  }
}
