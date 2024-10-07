import { Component, EventEmitter, Input, Output } from '@angular/core';
interface FileModel
{
  lastModified:number;
  name:string;
  size:number;
  lastModifiedDate?:Date;
  webkitRelativePath:string;
  type:string;
}
@Component({
  selector: 'stc-apps-dialog-modal',
  standalone: false,
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
