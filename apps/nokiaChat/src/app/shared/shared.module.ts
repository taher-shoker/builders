import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ChatListItemComponent } from './chat-list-item/chat-list-item.component';
import { SliderComponent } from './slider/slider.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
const components = [HeaderComponent, ChatListItemComponent, SliderComponent];
const modules = [CommonModule, SharedUiModule];
@NgModule({
  declarations: [...components],
  exports: [...components, ...modules],
  imports: [...modules],
})
export class SharedModule {}
