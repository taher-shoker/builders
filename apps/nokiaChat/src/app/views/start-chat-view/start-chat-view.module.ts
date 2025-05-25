import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StartChatViewComponent } from './start-chat-view.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './start-chat-view.routes';

@NgModule({
  declarations: [StartChatViewComponent],
  imports: [CommonModule, RouterModule.forChild(appRoutes)],
  exports: [RouterModule, StartChatViewComponent],
})
export class StartChatViewModule {}
