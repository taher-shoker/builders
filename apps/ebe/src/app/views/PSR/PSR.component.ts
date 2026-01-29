import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { FileModel, TapModel, UserModel } from '../../models/scorecard.model';
import { PSRService } from '../../services/psr.service';
import { TabDetailsComponent } from './components/tab-details/tab-details.component';
// import { PSRProjectCardComponent } from './components/project-card/project-card.component';
import { PSRDataModel } from '../../models/psr.model';
import { Subject, takeUntil } from 'rxjs';
import { ScorecardService } from '../../services/scorecard.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceService } from '../../services/device.service';
import { MobileViewHeaderComponent } from '../../components/mobile-view-header/mobile-view-header.component';
import { PSRProjectCardComponent } from './components/project-card/project-card.component';
@Component({
  selector: 'stc-apps-psr',
  standalone: true,
  imports: [
    CommonModule,
    SharedUiModule,
    TabDetailsComponent,
    MobileViewHeaderComponent,
    PSRProjectCardComponent,
  ],
  templateUrl: './PSR.component.html',
  styleUrl: './PSR.component.scss',
})
export class PSRComponent implements OnInit, OnDestroy {
  @ViewChild(TabDetailsComponent) child?: TabDetailsComponent;
  PSRTaps!: TapModel[];
  psrServices = inject(PSRService);
  toastr = inject(ToastrService);
  currentTab!: TapModel;
  psrData!: PSRDataModel[];
  endSubs$: Subject<PSRDataModel[]> = new Subject();
  scorecardService = inject(ScorecardService);
  isMobile = signal<boolean>(false);
  deviceService = inject(DeviceService);
  userData!: UserModel;
  ngOnInit(): void {
    this.isMobile.set(this.deviceService.isMobile());
    this.getExecuteViewData();
    if (this.scorecardService.getUserGroups()) {
      this.userData = JSON.parse(
        decodeURIComponent(this.scorecardService.getUserGroups())
      );
    }
  }
  isEmpty!: boolean;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  getUploadedFile(file: FileModel) {
    this.psrServices.uploadFile('executiveView', file).subscribe({
      next: () => {
        this.getExecuteViewData();
        this.toastr.success('The File is Saved Successfully');
        if (this.child) {
          this.child.visible = false;
        }
      },
      error: () => {
        if (this.child) {
          this.child.visible = false;
        }
      },
    });
  }
  private getExecuteViewData() {
    this.psrServices
      .getExecuteViewData()
      .pipe(takeUntil(this.endSubs$))
      .subscribe({
        next: (res: PSRDataModel[]) => {
          if (res.length === 0) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
            this.psrData = res;
          }
        },
      });
  }
  deleteProgram(id: number) {
    this.psrServices.deleteProgram(id).subscribe({
      next: () => {
        this.getExecuteViewData();
        this.toastr.success('The Program is Deleted Successfully');
      },
    });
  }
  getClickedTap(tab: TapModel) {
    this.currentTab = tab;
  }
  getProgramId(id: any) {}
}
