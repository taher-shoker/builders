import {
  Component,
  inject,
  input,
  InputSignal,
  OnInit,
  Output,
  signal,
  WritableSignal,
  EventEmitter,
  ViewChild
} from '@angular/core';
import {
  FileModel,
  ScorecardModel,
  TapModel,
} from '../../../../models/scorecard.model';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ScorecardService } from '../../../../services/scorecard.service';
// import { DialogModule } from 'primeng/dialog';
// import { FileUploadInputComponent } from '../../../../components/file-upload-input/file-upload-input.component';
import { EditModeViewComponent } from '../edit-mode-view/edit-mode-view.component';
import { Subject } from 'rxjs';
import { DialogModalComponent } from '../../../../components/dialog/dialog.component';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
interface filterOption
{
  month:number;
  year:number;
}
@Component({
  selector: 'stc-apps-tap-details',
  standalone: true,
  imports: [
    SharedUiModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    DialogModalComponent,
    EditModeViewComponent,
    OverlayPanelModule
  ],
  templateUrl: './tap-details.component.html',
  styleUrl: './tap-details.component.scss',
})
export class TapDetailsComponent implements OnInit {
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  scorcardData: InputSignal<ScorecardModel[]> = input.required<ScorecardModel[]>();
  currentMode: InputSignal<'editMode' | 'viewMode'> = input.required<'editMode' | 'viewMode'>();
  visible = false;
  endSubs$:Subject<ScorecardModel[]> = new Subject();
  selectedFile!:FileModel | null;
  currentClickedTap: InputSignal<TapModel> = input.required<TapModel>();
  isEmpty: InputSignal<boolean> = input.required<boolean>();
  monthsArr: { name: string; id: number }[] = [];
  years: WritableSignal<{ name: string; id: number }[]> = signal<{ name: string; id: number }[]>([]);
  filtersForm: FormGroup = new FormGroup({
    month: new FormControl(new Date().getMonth() + 1),
    year: new FormControl(new Date().getFullYear()),
  });
  @Output() filterOptions:EventEmitter<filterOption> = new EventEmitter();
  @Output() ImportedFile:EventEmitter<FileModel> = new EventEmitter();
  scorecardService = inject(ScorecardService);
  monthsArrPopulator() {
    for (let i = 1; this.monthsArr.length < 12; i++) {
      const date = new Date(2000, i - 1, 10); // 2009-11-10
      const month = date.toLocaleString('default', { month: 'short' });
      const monthObject = { name: month, id: i, selected: false };
      this.monthsArr.push(monthObject);
    }
  }
  ngOnInit(): void {    
    console.log(window.innerWidth);
    const yearsArr: { name: string; id: number }[] = [];
    const currYear: number = new Date().getFullYear();
    for (let index = 2024; index <= currYear; index++) {
      yearsArr.push({ name: index.toString(), id: index });
    }
    this.years.set(yearsArr);
    this.monthsArrPopulator();
    // this.filterOptions.emit(this.filtersForm.value);
  }
  get monthValue() {
    return this.filtersForm.get('month');
  }
  get yearValue() {
    return this.filtersForm.get('year');
  }
  selectYear() {
    console.log('month value => ', this.monthValue?.value);
    console.log('year value => ', this.yearValue?.value);
    this.filterOptions.emit(this.filtersForm.value);
  }
  selectMonth() {
    console.log('month value => ', this.monthValue?.value);
    console.log('year value => ', this.yearValue?.value);
    this.filterOptions.emit(this.filtersForm.value);
  }
  showDialog()
  {
    this.visible = true;
  }
  importData(e:FileModel)
  {
    if(e)
    {
      this.ImportedFile.emit(e);
    }
  }
  downloadTemplate()
  {
    this.scorecardService.downloadTemplate().subscribe({
      next : (response) => {
        this.downloadFile(response, `scorecards.csv`);
      }
    })
  }
  text()
  {
    this.overlayPanel2.toggle(event);
  }
  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  onHide()
  {
    this.visible = false;
  }
  hoverTitle!:string;
  showPopup(title:string)
  {
    if(title.trim().length > 95){
      this.hoverTitle = title;
      this.overlayPanel2.show(event)
    }
  }
}
