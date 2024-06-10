import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { appRoutes } from '../home/home.routes';
import { WelcomePageComponent } from './welcome-page.component';

const components = [WelcomePageComponent];
@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
})
export class WelcomePageModule {}
