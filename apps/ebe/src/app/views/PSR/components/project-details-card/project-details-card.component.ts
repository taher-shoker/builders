import { Component, ElementRef, EventEmitter, inject, Input, input, InputSignal, OnChanges, OnInit , Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProjectForm, ChartDetails, ProgressInfo, PSRProjectDetailsModel } from '../../../../models/psr.model';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { AddProjectFormComponent } from '../add-project-form/add-project-form.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PSRService } from '../../../../services/psr.services';

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
  @Input() isAdded!:boolean;
  projectData:InputSignal<PSRProjectDetailsModel> = input.required<PSRProjectDetailsModel>();
  @Output() addRecordInTable:EventEmitter<AddProjectForm> = new EventEmitter();
  @Output() closePopupEmit:EventEmitter<number> = new EventEmitter();
  @Output() sendData:EventEmitter<{id:number , data:ChartDetails[]}> = new EventEmitter();
  data!:ProgressInfo;
  showPopover = false;
  tableHeader!:ColumnsSchema[];
  months = ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'];
  @ViewChild('overlayPanel') overlayPanel!: OverlayPanel;
  visible = false;
  isEditMode!:boolean;
  psrServices = inject(PSRService)
  constructor(private elementRef: ElementRef , private confirmationService: ConfirmationService) {}
  ngOnInit(): void {
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
  newData!:PSRProjectDetailsModel;
  ngOnChanges(): void {
    this.newData = JSON.parse(JSON.stringify(this.projectData()));
    const start = this.projectData().startDate;
    const end = this.projectData().endDate;
    if(start && end)
    {
      if(+start.split("-")[2] && this.months[+start.split("-")[1] - 1] && +start.split("-")[0] && +end.split("-")[2] && this.months[+end.split("-")[1] - 1] && +end.split("-")[0])
      {
        const sd = `${+start.split("-")[2]}-${this.months[+start.split("-")[1] - 1]}-${+start.split("-")[0]}`;
        const ed = `${+end.split("-")[2]}-${this.months[+end.split("-")[1] - 1]}-${+end.split("-")[0]}`;
        this.projectData().startDate = sd;
        this.projectData().endDate = ed;
      }
    }
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
  formValues2:AddProjectForm[] = [];
  getFormValues(formValue:AddProjectForm)
  {
    this.selectedItem = null;
    this.formValues.push(formValue);
    this.formValues2.push(formValue);
    this.addRecordInTable.emit(formValue);
    this.visible = false;
    this.isEditMode = false;
    this.newData.chartDetails.push(formValue)
    // this.newData = JSON.parse(JSON.stringify(this.projectData()));
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
    // this.newData.chartDetails = this.newData.chartDetails.filter(val => val.major !== this.deletedData.major);
    // this.projectData().chartDetails = this.newData.chartDetails.filter(val => val.major !== this.deletedData.major);
    // this.formValues2 = this.formValues2.filter(val => val.major !== this.deletedData.major);
    // this.formValues = this.newData.chartDetails.filter(val => val.major !== this.deletedData.major);
    const isExists = this.formValues2.filter(val => val.id === this.deletedData.id)[0];
    this.newData.chartDetails = this.newData.chartDetails.filter(val => val.id !== this.deletedData.id);
    if(isExists)
      {
      this.formValues2 = this.formValues2.filter(val => val.id !== this.deletedData.id);
    } else {
      this.psrServices.addNewChartDetails(this.projectData().id , this.newData.chartDetails).subscribe({
        next : (res) => {
          this.newData.chartDetails = res;
          this.projectData().chartDetails = res;
          this.isEditMode = false;
          this.formValues = []
        },
        error : (error) => {
          if(error)
          {
            const isExists2 = this.newData.chartDetails.filter(val => val.id === this.deletedData.id)[0];
            if(!isExists2)
            {
              this.newData.chartDetails.push(this.deletedData);
            }
          }
        } 
      })
    }
    // console.log(this.deletedData);
    this.close();
  }
  selectedItem!:ChartDetails | null;
  cancel()
  {
    this.formValues = [];
    this.closePopupEmit.emit(this.projectData().id)
    this.isEditMode = false;
    const filteredArray = this.tableHeader.filter(obj => obj.key === '');
    if(filteredArray.length === 0)
    {
      this.tableHeader.push({
        key : "",
        type : "text",
        label : ""
      });
    }
    this.newData = JSON.parse(JSON.stringify(this.projectData()));
    this.formValues2 = [];
  }
  closePopup()
  {
    this.overlayPanel.hide();
    this.formValues = []
    this.isEditMode = false;
    this.closePopupEmit.emit(this.projectData().id)
    const filteredArray = this.tableHeader.filter(obj => obj.key === '');
    this.formValues2 = [];
    if(filteredArray.length === 0)
    {
      this.tableHeader.push({
        key : "",
        type : "text",
        label : ""
      });
    }
    this.newData = JSON.parse(JSON.stringify(this.projectData()));
  }
  getUpdatedData(e:{items:ChartDetails[] , id:number})
  {
    this.selectedItem = e.items.filter(val => val.id === e.id)[0];
    console.log(this.selectedItem);
  }
  addRecord()
  {
    this.showAddRecordForm();
  }
  saveData()
  {
    const isExists = this.tableHeader.filter(val => val.key === '')[0]
    if(!isExists)
    {
      this.tableHeader.push({
        key : "",
        type : "text",
        label : ""
      });
    }
    this.psrServices.addNewChartDetails(this.projectData().id , this.newData.chartDetails).subscribe({
      next : (res) => {
        this.newData.chartDetails = res;
        this.projectData().chartDetails = res;
        this.isEditMode = false;
        this.formValues = []
        this.formValues2 = []
      }
    })
  }
  editMode()
  {
    console.log('sfd');
    this.isEditMode = true;
    const filteredArray = this.tableHeader.filter(obj => obj.key !== '');
    this.tableHeader = filteredArray;
  }
}
