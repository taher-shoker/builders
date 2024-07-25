/* eslint-disable @nx/enforce-module-boundaries */
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BannerDataService } from '@stc-apps/shared-ui';
import { ToastrService } from 'ngx-toastr';
import { ReportsService } from '../../dy-reports.service';

@Component({
  selector: 'stc-apps-add-dy-report',
  templateUrl: './add-dy-report.component.html',
  styleUrls: ['./add-dy-report.component.scss'],
})
export class AddDyReportComponent {}
