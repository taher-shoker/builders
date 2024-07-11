import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
// import { SharedUiModule } from '@stc-apps/shared-ui';
import { SidebarComponent } from './components/sidebar/sidebar.component';
@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, MainLayoutComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes) , SidebarComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
