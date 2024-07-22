import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { TopBannerComponent } from './top-banner/top-banner.component';

const components = [TopBannerComponent];
const modules = [CommonModule, SharedUiModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
