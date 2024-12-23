import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatViewComponent } from './chat-view.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './chat-view.routes';

const components = [ChatViewComponent];
const modules = [
  CommonModule,
  SharedModule,
  FormsModule,
  RouterModule.forChild(appRoutes),
];
@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, RouterModule],
})
export class ChatViewModule {}
