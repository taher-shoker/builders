import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { ResultWeightCardComponent } from './components/result-weight-card/result-weight-card.component';
import { ScoreCardTabsComponent } from './components/score-card-tabs/score-card-tabs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { appRoutes } from './home.routes';

const components = [
  HomeComponent,
  ResultWeightCardComponent,
  ScoreCardTabsComponent,
];
const modules = [
  FormsModule,
  ReactiveFormsModule,
  SharedModule,
  RouterModule.forRoot(appRoutes),
];
@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [...modules],
})
export class HomeModule {}
