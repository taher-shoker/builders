import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { HeaderComponent } from './header/header.component';
import { PopUpImageComponent } from './pop-up-image/pop-up-image.component';

const components = [ChatListItemComponent, HeaderComponent,PopUpImageComponent];
const modules = [CommonModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
