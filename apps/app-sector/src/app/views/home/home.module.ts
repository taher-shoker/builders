import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ResultWeightCardComponent } from './components/result-weight-card.component';

@NgModule({
  declarations: [HomeComponent,ResultWeightCardComponent],
  imports: [CommonModule],
  exports: [HomeComponent, ResultWeightCardComponent]
})
export class HomeModule {}
