import { Component, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import {FileModel, ScorecardModel,ScorecardTaps} from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { TapDetailsComponent } from './components/tap-details/tap-details.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { Subject, takeUntil } from 'rxjs';
interface FilteredOptions
{
  month:number;
  year:number;
}
@Component({
  selector: 'stc-apps-scorecard',
  standalone: true,
  imports: [TapDetailsComponent, SharedUiModule, PageHeaderComponent],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent implements OnInit , OnDestroy{
  currentMode!: 'editMode' | 'viewMode';
  endSubs$:Subject<ScorecardModel[]> = new Subject();
  kpisData: WritableSignal<ScorecardModel[]> = signal([]);
  currentClickedTapData!: ScorecardTaps;
  scorecardsTaps!: ScorecardTaps[];
  isEmpty = false;
  filtersOptions!:FilteredOptions;
  scorecardService = inject(ScorecardService);
  @ViewChild(TapDetailsComponent) child?: TapDetailsComponent;
  username!:string;
  currYear = new Date().getFullYear()
  ngOnInit(): void {
    this.scorecardsTaps = this.scorecardService.getScorecardsTaps();
    this.currentClickedTapData = this.scorecardsTaps[0];
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    this.scorecardService.getUsername().subscribe({
      next : (name) => {
        this.username = name;
      }
    })
  }
  private getScorecardData(month:number , year:number , tapName?:string)
  {
    this.scorecardService.getScorecardData(month , year , tapName).pipe(takeUntil(this.endSubs$)).subscribe({
      next : (scorecards:ScorecardModel[]) => {
        console.log(scorecards);
        if(scorecards.length === 0)
          {
            this.isEmpty = true;
          } else {
          this.kpisData.set(scorecards)
          this.isEmpty = false;
        }
      }
    })
  }
  ngOnDestroy()
  {
    this.endSubs$.complete()
  }
  getClickedTap(clickedTap: ScorecardTaps) {
    this.currentClickedTapData = clickedTap;
    this.getScorecardData(this.filtersOptions.month , this.filtersOptions.year , clickedTap.value)
  }
  getFiltersOptions(options:FilteredOptions)
  {
    this.filtersOptions = options;
    this.getScorecardData(options.month , options.year , this.currentClickedTapData.value);
  }
  getImportedFile(e:FileModel)
  {
    if(e)
    {
      this.scorecardService.uploadFile(e).subscribe({
        next : () => {
          if(this.child)
          {
            this.getScorecardData(this.filtersOptions.month , this.filtersOptions.year , this.currentClickedTapData.value)
            this.child.visible = false;
          }
        },
        error : () => {
          if(this.child)
          {
            this.child.visible = false;
          }
        }
      })
    }
  }
}
