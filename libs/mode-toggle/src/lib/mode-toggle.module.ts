import { NgModule } from '@angular/core';
import {
  MODE_STORAGE_SERVICE,
  ModeLocalStorageService,
} from './mode-storage.service';
import { ModeToggleComponent } from './mode-toggle.component';
import { ModeToggleService } from './mode-toggle.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, RouterModule, TranslateModule],
  declarations: [ModeToggleComponent],
  providers: [
    ModeToggleService,
    {
      provide: MODE_STORAGE_SERVICE,
      useClass: ModeLocalStorageService,
    },
  ],
  exports: [ModeToggleComponent],
})
export class ModeToggleModule {}
