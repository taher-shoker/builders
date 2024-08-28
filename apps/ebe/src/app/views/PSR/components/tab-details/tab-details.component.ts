import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRProjectCardComponent } from "../project-card/project-card.component";
import { PSRDataModel } from '../../../../models/psr.model';
import { ScorecardService } from '../../../../services/scorecard.service';
import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { DialogModalComponent } from '../../../../components/dialog/dialog.component';
import { FileModel } from '../../../../models/scorecard.model';
import { PSRService } from '../../../../services/psr.services';

@Component({
  selector: 'stc-apps-tab-details',
  standalone: true,
  imports: [CommonModule, SharedUiModule, PSRProjectCardComponent , EditModeViewComponent , DialogModalComponent],
  templateUrl: './tab-details.component.html',
  styleUrl: './tab-details.component.scss',
})
export class TabDetailsComponent implements OnInit{
  visible = false;
  projects:InputSignal<PSRDataModel[]> = input.required<PSRDataModel[]>();
  isEmpty:InputSignal<boolean> = input.required<boolean>();
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService)
  psrService = inject(PSRService);
  ngOnInit(): void {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
  }
  showDialog()
  {
    this.visible = true;
  }
  downloadTemplate()
  {
    this.psrService.downloadExecutiveViewTemplate().subscribe({
      next : (res) => {
        this.downloadFile(res, `psrProjects.csv`);
      }
    })
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
  importData(file:FileModel | null)
  {
    if(file)
    {
      console.log(file);
    }
  }
  onHide()
  {
    this.visible = false;
  }
}
