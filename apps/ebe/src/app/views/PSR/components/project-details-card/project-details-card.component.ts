import { Component, ElementRef, EventEmitter, input, InputSignal, OnChanges, OnInit , Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjectForm, ChartDetails, ProgressInfo, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { AddProjectFormComponent } from '../add-project-form/add-project-form.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

export interface ColumnsSchema {
  key: string;
  type: 'text' | 'date' | 'actions' | 'custom';
  label: string;
}
@Component({
  selector: 'stc-apps-project-details-card',
  standalone: true,
  imports: [CommonModule , SharedUiModule , OverlayPanelModule , DialogModule , AddProjectFormComponent , ConfirmDialogModule],
  templateUrl: './project-details-card.component.html',
  styleUrl: './project-details-card.component.scss',
  providers : [ConfirmationService]
})
export class ProjectDetailsCardComponent implements OnInit , OnChanges{
  projectData:InputSignal<PSRProjectDetailsModel> = input.required<PSRProjectDetailsModel>();
  @Output() addRecordInTable:EventEmitter<AddProjectForm> = new EventEmitter();
  @Output() closePopupEmit:EventEmitter<number> = new EventEmitter();
  @Output() sendData:EventEmitter<number> = new EventEmitter();
  data!:ProgressInfo;
  showPopover = false;
  tableHeader!:ColumnsSchema[];
  months = ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'];
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  visible = false;
  constructor(private elementRef: ElementRef , private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
    this.data = {
      prefixText: '',
      prefixValue: 0,
      suffixText: '',
      suffixValue: 0,
      progressValue: 100,
      barColor:'#00C48C',
      bgBarColor:'#00c48c1a',
      indexes: [
        {
          caption: 'Actual',
          value: this.projectData().vactual,
          position: 'up',
        },
        {
          caption: `Planned`,
          value: this.projectData().vplanned,
          position: 'down',
        },
      ],
    };
    this.tableHeader = [
      {
        key : "id",
        type : "text",
        label : "ID"
      },
      {
        key : "major",
        type : "text",
        label : "Major Activities/Deliverables"
      },
      {
        key : "start",
        type : "text",
        label : "Start"
      },
      {
        key : "duration",
        type : "text",
        label : "Duration"
      },
      {
        key : "completion_level",
        type : "text",
        label : "Completion Level"
      },
      {
        key : "",
        type : "text",
        label : ""
      },
    ]
  }
  ngOnChanges(): void {
    const start = this.projectData().startDate;
    const end = this.projectData().endDate;
    if(start && end)
    {
      const sd = `${+start.split("-")[2]}-${this.months[+start.split("-")[1] - 1]}-${+start.split("-")[0]}`;
      const ed = `${+end.split("-")[2]}-${this.months[+end.split("-")[1] - 1]}-${+end.split("-")[0]}`;
      this.projectData().startDate = sd;
      this.projectData().endDate = ed;
    }
  }
  displayDrilldown()
  {
    this.overlayPanel.toggle(event);
  }
  showAddRecordForm()
  {
    this.visible = true;
  }
  formValues:AddProjectForm[] = [];
  getFormValues(formValue:AddProjectForm)
  {
    console.log(formValue);
    this.formValues.push(formValue);
    this.addRecordInTable.emit(formValue);
    this.visible = false;
  }
  deletedData!:ChartDetails;
  deleteRecord(e:ChartDetails)
  {
    this.deletedData = e;
    this.confirmationService.confirm({
      key: 'delete-record'
    });
  }
  close()
  {
    this.confirmationService.close()
  }
  deleteRecordRow()
  {
    console.log(this.deletedData);
  }
  cancel()
  {
    this.formValues = [];
    this.closePopupEmit.emit(this.projectData().id)
  }
  closePopup()
  {
    this.overlayPanel.hide();
    this.formValues = []
    this.closePopupEmit.emit(this.projectData().id)
  }
  addRecord()
  {
    this.showAddRecordForm();
  }
  saveData()
  {
    this.sendData.emit(this.projectData().id);
  }
}
