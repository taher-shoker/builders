import { Component, EventEmitter, inject, input, InputSignal, OnChanges, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PSRChartDataModel, PSRDataModel } from '../../../../models/psr.model';
import { SharedUiModule } from "@stc-apps/shared-ui";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'stc-apps-psr-project-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , RouterModule , OverlayPanelModule , MenuModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  providers : [ConfirmationService]
})
export class PSRProjectCardComponent implements OnChanges {
  router = inject(Router);
  route = inject(ActivatedRoute);
  isAllowed = input<boolean>()
  @Output() ProgramId:EventEmitter<number> = new EventEmitter();
  months:string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  maxTextLength = 0;
  items = [
    {
        items: [
            {
                label: 'Edit',
                icon: 'pi pi-pen-to-square'
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash'
            }
        ]
    }
];
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  @ViewChild('overlayPanel2') overlayPanel2!: OverlayPanel;
  project:InputSignal<PSRDataModel> = input.required<PSRDataModel>();
  colors:string[] = ['#4F008C' , '#B999D1'];
  chartData!:PSRChartDataModel;
  private confirmationService = inject(ConfirmationService);
  ngOnChanges(): void {    
    this.chartData = {
      actual : this.project().actual ? this.project().actual : 0,
      planned : this.project().planned ? this.project().planned : 0
    }
    const textArr:string[] = this.project().details?.trim()?.split(' ') ?? [];
    const filteredArray = textArr.filter(item => item !== '');
    this.maxTextLength = filteredArray.length;
    // console.log(filteredArray);
  }
  formatDate(date:string)
  {
    const fullDate = date.split("-");
    const day = fullDate[2];
    const monthName = this.months[+fullDate[1] - 1];
    const year = fullDate[0];
    return `${day} ${monthName}-${year}`;
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  displayDrilldown2()
  {
    this.overlayPanel2.toggle(event);
  }
  gotoEditPage()
  {
    // this.router.navigateByUrl(`/psr/edit-project/${this.project().sector}`);
    this.router.navigate(['edit-program' , this.project().id] , { relativeTo: this.route })
  }
  showDeleteDialog()
  {
    this.confirmationService.confirm({
      key: 'delete-program'
    });
  }
  close()
  {
    this.confirmationService.close()
  }
  deleteProgram()
  {
    console.log(this.project());
    this.ProgramId.emit(this.project().id);
    this.close();
  }
  gotoProjectDetailsPage(){
   localStorage.setItem("sector" , this.project().sector) 
  }
}
