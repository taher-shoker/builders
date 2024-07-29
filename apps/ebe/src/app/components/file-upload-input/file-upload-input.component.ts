import { Component, EventEmitter, input, OnChanges, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileModel } from '../../models/scorecard.model';
@Component({
  selector: 'stc-apps-file-upload-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-upload-input.component.html',
  styleUrl: './file-upload-input.component.scss',
})
export class FileUploadInputComponent implements OnChanges , OnInit{
  selectedFile!:FileModel | null;
  @Output() uploadedFile:EventEmitter<FileModel | null> = new EventEmitter();
  isHidden = input<boolean>();
  fileSize = '';
  fileSizeNum = 0;
  getUploadedFile(e: Event) {
    if (e.target && (e.target as HTMLInputElement).files) {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        this.selectedFile = files['0'];
        // console.log(this.selectedFile);
        const fileSize = this.selectedFile.size;
        this.fileSizeNum = fileSize / (1024 * 1024);
        this.fileSize = this.formatBytes(fileSize);
        if(this.fileSizeNum < 3)
        {
          this.uploadedFile.emit(this.selectedFile);
        }
      }
    }
  }
  formatBytes(bytes:number, decimals = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }
  ngOnInit()
  {
    console.log(this.selectedFile);
  }
  ngOnChanges()
  {
    if(this.isHidden() === true)
    {
      this.selectedFile = null
      this.uploadedFile.emit(this.selectedFile);
      this.fileSizeNum = 0;
    }
  }
  removeFile()
  {
    this.selectedFile = null
    this.uploadedFile.emit(this.selectedFile);
  }
}
