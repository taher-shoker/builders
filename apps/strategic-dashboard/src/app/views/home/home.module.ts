import { NgModule } from '@angular/core';
import { KpiCardHeaderComponent } from './components/kpi-card-header/kpi-card-header.component';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './home.routes';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { BannerComponent } from './components/banner/banner.component';
import { CardsHolderComponent } from './components/cards-holder/cards-holder.component';

const components = [
  HomeComponent,
  KpiCardHeaderComponent,
  KpiCardComponent,
  BannerComponent,
  CardsHolderComponent,
];

const modules = [SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class HomeModule {}
