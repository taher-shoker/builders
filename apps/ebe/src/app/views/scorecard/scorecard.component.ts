import { Component, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import {FileModel, ScorecardModel,TapModel} from '../../models/scorecard.model';
import { ScorecardService } from '../../services/scorecard.service';
import { TapDetailsComponent } from './components/tap-details/tap-details.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { PageHeaderComponent } from '../../components/pageHeader/page-header.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
interface FilteredOptions
{
  month:number;
  year:number;
}
@Component({
  selector: 'stc-apps-scorecard',
  standalone: true,
  imports: [TapDetailsComponent, SharedUiModule, PageHeaderComponent , CommonModule],
  templateUrl: './scorecard.component.html',
  styleUrl: './scorecard.component.scss'
})
export class ScorecardComponent implements OnInit , OnDestroy{
  currentMode!: 'editMode' | 'viewMode';
  endSubs$:Subject<ScorecardModel[]> = new Subject();
  kpisData: WritableSignal<ScorecardModel[]> = signal([]);
  currentClickedTapData!: TapModel;
  scorecardsTaps!: TapModel[];
  isEmpty = false;
  filtersOptions!:FilteredOptions;
  scorecardService = inject(ScorecardService);
  @ViewChild(TapDetailsComponent) child?: TapDetailsComponent;
  currYear = new Date().getFullYear()
  ngOnInit(): void {
    this.getInitScorecardsTaps(new Date().getMonth() + 1 , new Date().getFullYear() , true);
    // this.scorecardsTaps = this.scorecardService.getScorecardsTaps();
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
    // this.scorecardService.getUsername().subscribe({
    //   next : (name) => {
    //     this.username = name;
    //   }
    // })
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
  getClickedTap(clickedTap: TapModel) {
    this.currentClickedTapData = clickedTap;    
    if(this.filtersOptions)
    {
      this.getScorecardData(this.filtersOptions.month , this.filtersOptions.year , clickedTap.value)
    } else {
      this.getScorecardData(new Date().getMonth() + 1 , new Date().getFullYear() , clickedTap.value)
    }
  }
  getFiltersOptions(options:FilteredOptions)
  {
    this.filtersOptions = options;
    this.getScorecardData(options.month , options.year , this.currentClickedTapData.value);
  }
  private getInitScorecardsTaps(month:number , year:number , initApp:boolean)
  {
    this.scorecardService.getScorecardData().pipe(takeUntil(this.endSubs$)).subscribe({
      next : (scorecards:ScorecardModel[]) => {
        console.log(scorecards);
        const data:TapModel[] = [];
        scorecards.forEach((scorecard , index) => {
          scorecard.kpiDataDTO.forEach(kpi => {
            data.push({
              id : index + 1,
              name : kpi.group,
              value : kpi.group
            })
          })
        })
        const uniqueObjects:TapModel[] = data.filter((obj, index , self) =>
          index === self.findIndex((t) => (
            t.name === obj.name
          ))
        );
        // console.log(uniqueObjects);
        this.scorecardsTaps = uniqueObjects
        if(initApp)
        {
          this.currentClickedTapData = this.scorecardsTaps[0];
        }
        this.getScorecardData(month , year , this.currentClickedTapData.value);
      }
    })
  }
  getImportedFile(e:FileModel)
  {
    if(e)
    {
      this.scorecardService.uploadFile(e).subscribe({
        next : () => {
          if(this.child)
          {
            // this.getScorecardData(this.filtersOptions.month , this.filtersOptions.year , this.currentClickedTapData.value)
            if(this.filtersOptions)
            {
              this.getInitScorecardsTaps(this.filtersOptions.month , this.filtersOptions.year , false) 
            } else {
              this.getInitScorecardsTaps(new Date().getMonth() + 1 , new Date().getFullYear() , false) 
            }
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
