import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultScoreComponent } from './result-score/result-score.component';
import { TabsComponent } from './tabs/tabs.component';
import { TabComponent } from './tabs/tab/tab.component';
import { SharedUiModule } from '@stc-apps/shared-ui';
import { CommentEditorComponent } from './comment-editor/comment-editor.component';
import { ProfileComponent } from './profile/profile.component';

const components = [
  ResultScoreComponent,
  TabsComponent,
  TabComponent,
  CommentEditorComponent,
  ProfileComponent,
];
const modules = [CommonModule, SharedUiModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
