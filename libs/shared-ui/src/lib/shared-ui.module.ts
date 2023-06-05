import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './header/header.component';
import { InputComponent } from './input/input.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LngSelectorModule } from '@stc-apps/lng-selector';
import { BreadCrumbModule } from './breadcrumb/breadcrumb.module';
import { ModeToggleModule } from '@stc-apps/mode-toggle';
import { BannerComponent } from './banner/banner.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    LngSelectorModule,
    BreadCrumbModule,
    ModeToggleModule,
  ],
  declarations: [
    ButtonComponent,
    HeaderComponent,
    InputComponent,
    BannerComponent,
  ],
  exports: [
    HeaderComponent,
    BreadCrumbModule,
    InputComponent,
    ButtonComponent,
    BannerComponent,
  ],
})
export class SharedUiModule {}
