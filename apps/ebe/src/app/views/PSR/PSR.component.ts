import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TapModel } from '../../models/scorecard.model';
import { PSRService } from '../../services/psr.services';
import { TabDetailsComponent } from './components/tab-details/tab-details.component';
import { PSRProjectCardComponent } from './components/project-card/project-card.component';
import { PSRDataModel } from '../../models/psr.model';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-psr',
  standalone: true,
  imports: [CommonModule , PageHeaderComponent , SharedUiModule , TabDetailsComponent , PSRProjectCardComponent],
  templateUrl: './PSR.component.html',
  styleUrl: './PSR.component.scss',
})
export class PSRComponent implements OnInit , OnDestroy {
  PSRTaps!:TapModel[];
  psrServices = inject(PSRService);
  currentTab!:TapModel;
  psrData!:PSRDataModel[];
  endSubs$:Subject<PSRDataModel[]> = new Subject();
  ngOnInit(): void {
    this.getExecuteViewData();
  }
  isEmpty!:boolean;
  ngOnDestroy(): void {
    this.endSubs$.complete();
  }
  private getExecuteViewData()
  {
    this.psrServices.getExecuteViewData().pipe(takeUntil(this.endSubs$)).subscribe({
      next : (res:PSRDataModel[]) => {
        if(res.length === 0)
        {
          this.isEmpty = true;
        } else {
          this.isEmpty = false;
          this.psrData = res;
        }
      }
    })
  }
  getClickedTap(tab:TapModel)
  {
    this.currentTab = tab;
    console.log(tab);
  }
}
