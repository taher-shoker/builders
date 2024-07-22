import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home.routes';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared/shared.module';
import { KpiCardHeaderComponent } from './components/kpi-card-header/kpi-card-header.component';

const components = [HomeComponent,KpiCardHeaderComponent];
const modules = [HomeRoutingModule, SharedModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components],
})
export class HomeModule {}
