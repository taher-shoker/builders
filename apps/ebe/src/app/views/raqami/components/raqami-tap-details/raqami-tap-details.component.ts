import {
  Component,
  inject,
  input,
  InputSignal,
  OnChanges,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileModel, TapModel } from '../../../../models/scorecard.model';
import { A1TapComponent } from '../a1-tap/a1-tap.component';
import { A2TapComponent } from '../a2-tap/a2-tap.component';
import { A3TapComponent } from '../a3-tap/a3-tap.component';
import {
  A2TapData,
  A3TapData,
  RaqamiKpiData,
} from '../../../../models/raqami.model';
import { RaqamiService } from '../../../../services/raqami.service';
import { ScorecardService } from '../../../../services/scorecard.service';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-raqami-tap-details',
  standalone: true,
  imports: [
    CommonModule,
    A1TapComponent,
    A2TapComponent,
    A3TapComponent,
    SharedUiModule,
  ],
  templateUrl: './raqami-tap-details.component.html',
  styleUrl: './raqami-tap-details.component.scss',
})
export class RaqamiTapDetailsComponent implements OnInit, OnChanges {
  raqamiKpiData!: RaqamiKpiData[];
  raqamiA2Data!: A2TapData[];
  raqamiA3Data!: A3TapData[];
  currentTap: InputSignal<TapModel> = input.required<TapModel>();
  private raqamiService = inject(RaqamiService);
  currentMode!: 'editMode' | 'viewMode';
  visible = false;
  private scorecardService = inject(ScorecardService);
  ngOnInit(): void {
    this.scorecardService.getCurrentMode().subscribe({
      next: (res: 'editMode' | 'viewMode') => {
        this.currentMode = res;
      },
    });
  }
  ngOnChanges(): void {
    if (this.currentTap().name === 'A1') {
      this.raqamiKpiData = this.raqamiService.raqamiKpiData;
      this.raqamiA2Data = [];
      this.raqamiA3Data = [];
    } else if (this.currentTap().name === 'A2') {
      this.raqamiA2Data = this.raqamiService.raqamiA2Data;
      this.raqamiKpiData = [];
      this.raqamiA3Data = [];
    } else if (this.currentTap().name === 'A3') {
      this.raqamiA3Data = this.raqamiService.raqamiA3Data;
      this.raqamiKpiData = [];
      this.raqamiA2Data = [];
    }
  }
  showDialog() {
    this.visible = true;
  }
  downloadTemplate() {
    console.log('dfsfs');
  }
  ImportFile(uploadFile: FileModel | null) {
    if (uploadFile) {
      console.log(uploadFile);
      console.log(this.currentTap());
    }
  }
  downloadFile(data: string, filename: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
