import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import {
  ScorecardModel,
  ScorecardTaps,
} from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { TapDetailsComponent } from './components/tap-details/tap-details.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
interface FilteredOptions
{
  month:number;
  year:number;
}
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'stc-apps-scorecard',
  standalone: true,
  imports: [TapDetailsComponent, SharedUiModule, PageHeaderComponent],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss',
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
  ngOnInit(): void {
    this.scorecardsTaps = this.scorecardService.getScorecardsTaps();
    this.currentClickedTapData = this.scorecardsTaps[0];
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
  }
  private getScorecardData(tapName:string , month:number , year:number)
  {
    this.scorecardService.getScorecardData(tapName , month , year).pipe(takeUntil(this.endSubs$)).subscribe({
      next : (scorecards:ScorecardModel[]) => {
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
    this.getScorecardData(clickedTap.name , this.filtersOptions.month , this.filtersOptions.year)
  }
  getFiltersOptions(options:FilteredOptions)
  {
    this.filtersOptions = options;
    this.getScorecardData(this.currentClickedTapData.name , options.month , options.year);
  }
}
