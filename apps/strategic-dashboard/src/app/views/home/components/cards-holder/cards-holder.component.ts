import { Component, OnInit } from '@angular/core';
import { StrategicGroupsService } from '../../services/strategic-groups.service';
import { StrategicGroup } from '../../models/strategic-group.model';
import { SharedFormService } from '../../../../shared/services/shared-form.service';
import { forkJoin, map, Subject } from 'rxjs';

@Component({
  selector: 'stc-apps-cards-holder',
  templateUrl: './cards-holder.component.html',
  styleUrls: ['./cards-holder.component.scss'],
})
export class CardsHolderComponent implements OnInit {
  activeIndex: number | null = null;
  kpis: any = {};
  strategicGroups: StrategicGroup[] = [];
  strategicName = '';
  private hoverSubject = new Subject<{ index: number; name: string }>();
  private strategicNameSubject = new Subject<string>();
  strategicGroupKpis: any[] = [];

  constructor(
    private strategicGroupsService: StrategicGroupsService,
    private sharedFormService: SharedFormService
  ) {}

  ngOnInit(): void {
    this.getAllStrategicGroups();
  }
  getAllStrategicGroups() {
    const params = {
      year: this.sharedFormService.getForm().controls['year'].value,
    };
    this.strategicGroupsService.getAllStrategicGroups(params).subscribe(
      (result: StrategicGroup[]) => {
        this.strategicGroups = result;
        this.loadKpisForStrategicGroups(result);
      },
      (error) => {
        console.error('Error fetching strategic groups:', error);
      }
    );
  }

  loadKpisForStrategicGroups(groups: StrategicGroup[]) {
    const year = this.sharedFormService.getForm().controls['year'].value;
    const kpiObservables = groups?.map((group) =>
      this.strategicGroupsService.getAllStrategicGroupKpis({
        year: year,
        strategicName: group?.name,
      })
    );
    forkJoin(kpiObservables)
      .pipe(
        // Combine all results into a single array
        map((results) => {
          const groupedKpis: { [key: string]: any[] } = {};
          results.flat().forEach((kpi: any) => {
            // Use the strategicGroupName as the key
            const key = kpi.strategicGroupName;

            if (!groupedKpis[key]) {
              groupedKpis[key] = [];
            }

            groupedKpis[key].push(kpi);
          });
          return groupedKpis;
        })
      )
      .subscribe(
        (groupedKpis: { [key: string]: any[] }) => {
          this.strategicGroupKpis.push(groupedKpis);
          console.log(this.strategicGroupKpis);
        },
        (error) => {
          console.error('Error fetching KPIs:', error);
        }
      );
  }

  getCurrentContents(index: number): any[] {
    let allContents: any[] = [];

    for (let i = 0; i <= index; i++) {
      const kpi = this.strategicGroups[i];
      if (kpi) {
        if (Array.isArray(kpi)) {
          allContents.push(...kpi);
        } else {
          allContents.push(kpi);
        }
      }
    }
    return allContents;
  }

  onCardHover(index: number, strategicName: string) {
    this.activeIndex = index;
    this.strategicName = strategicName;
  }

  onCardLeave() {
    this.activeIndex = null;
  }
}
