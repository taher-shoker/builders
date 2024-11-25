import { Component, EventEmitter, inject, input, InputSignal, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PSRProjectCardComponent } from "../project-card/project-card.component";
import { PSRDataModel } from '../../../../models/psr.model';
import { ScorecardService } from '../../../../services/scorecard.service';
// import { EditModeViewComponent } from '../../../scorecard/components/edit-mode-view/edit-mode-view.component';
import { FileModel, UserGroup } from '../../../../models/scorecard.model';
import { PSRService } from '../../../../services/psr.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'stc-apps-tab-details',
  standalone: true,
  imports: [CommonModule, SharedUiModule, PSRProjectCardComponent , RouterLink],
  templateUrl: './tab-details.component.html',
  styleUrl: './tab-details.component.scss',
})
export class TabDetailsComponent implements OnInit{
  @Output() getUploadedFile:EventEmitter<FileModel> = new EventEmitter();
  visible = false;
  projects:InputSignal<PSRDataModel[]> = input.required<PSRDataModel[]>();
  @Output() ProgramId:EventEmitter<number> = new EventEmitter();
  isEmpty:InputSignal<boolean> = input.required<boolean>();
  currentMode!: 'editMode' | 'viewMode';
  scorecardService = inject(ScorecardService)
  psrService = inject(PSRService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  userRoles!:UserGroup;
  isAllowed = false;
  ngOnInit(): void {
    this.userRoles = this.scorecardService.userRoles;
    this.isAllowed = this.userRoles.roles.some(role => role.roleName === 'BE_EDITORS' || role.roleName === "ADMINS" || role.roleName === "BE_PMO");
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
  getProgramId(id:number)
  {
    this.ProgramId.emit(id);
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
      this.getUploadedFile.emit(file);
    }
  }
  onHide()
  {
    this.visible = false;
  }
  gotoaddForm()
  {
    // this.router.navigate(['add-project'] , { relativeTo: this.route })
    // this.router.navigate(['/.envpsr/add-project'])
    // this.router.navigateByUrl('/psr/add-project')
  }
}
