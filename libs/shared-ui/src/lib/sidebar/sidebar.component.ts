import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { SidebarLinksModel } from './sidebarLinks.model';
@Component({
  selector: 'stc-apps-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit{
  // @Input({required : true}) logoSrc!:string;
  editModeChecked = false;
  logoSrc = input.required<string>({alias : 'logoSrc'})
  usernameImage = input<string>()
  userName = input<string>()
  // isEditModeChecked = input<boolean>()
  sidebarLinks = input.required<SidebarLinksModel[]>()
  activeMode:'editMode' | 'viewMode' = 'viewMode';
  @Output() currentMode:EventEmitter<'editMode' | 'viewMode'> = new EventEmitter();
  ngOnInit()
  {
    this.currentMode.emit(this.activeMode);
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
