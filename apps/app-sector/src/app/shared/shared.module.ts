import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultScoreComponent } from './result-score/result-score.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab/tab.component';
import { SharedUiModule } from '@stc-apps/shared-ui';

const components = [ResultScoreComponent, TabsComponent, TabComponent];
const modules = [CommonModule, SharedUiModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
