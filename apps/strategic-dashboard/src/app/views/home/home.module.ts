import { NgModule } from '@angular/core';
import { KpiCardHeaderComponent } from './components/kpi-card-header/kpi-card-header.component';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './home.routes';
import { KpisCardComponent } from './components/kpi-card/kpi-card.component';
import { BannerComponent } from './components/banner/banner.component';
import { CardsHolderComponent } from './components/cards-holder/cards-holder.component';

const components = [
  HomeComponent,
  KpiCardHeaderComponent,
  KpisCardComponent,
  BannerComponent,
  CardsHolderComponent,
];

const modules = [SharedModule, RouterModule.forChild(appRoutes)];

@NgModule({
  declarations: [...components],
  imports: [...modules],
})
export class HomeModule {}
