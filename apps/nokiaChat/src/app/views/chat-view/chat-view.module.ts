import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatViewComponent } from './chat-view.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './chat-view.routes';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
const components = [ChatViewComponent];
const modules = [
  CommonModule,
  RouterModule.forChild(appRoutes),
  SharedModule,
  FormsModule,
];
@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [...modules],
})
export class ChatViewModule {}
