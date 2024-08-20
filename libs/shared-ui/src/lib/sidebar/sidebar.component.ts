import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { SidebarLinksModel } from './sidebarLinks.model';
import { NavigationStart, Router } from '@angular/router';
@Component({
  selector: 'stc-apps-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit{
  editModeChecked!:boolean;
  logoSrc = input.required<string>({alias : 'logoSrc'})
  usernameImage = input<string>()
  userName = input<string>()
  router = inject(Router)
  // tabChanged = input<boolean>()
  // isEditModeChecked = input<boolean>()
  sidebarLinks = input.required<SidebarLinksModel[]>()
  activeMode:'editMode' | 'viewMode' = 'viewMode';
  @Output() currentMode:EventEmitter<'editMode' | 'viewMode'> = new EventEmitter();
  ngOnInit()
  {
    this.currentMode.emit(this.activeMode);
    this.router.events.subscribe({
      next : (res) => {
        if (res instanceof NavigationStart) {
          this.editModeChecked = false;
        }
      }
    })
  }
  // ngOnDestory()
  // {
  //   this.activeMode = 'viewMode';
  //   this.editModeChecked = false;
  // }
  switchEditMode()
  {
    if(this.editModeChecked === true)
    {
      this.activeMode = 'editMode';
    } else {
      this.activeMode = 'viewMode';
    }
    this.currentMode.emit(this.activeMode);
  }
}
