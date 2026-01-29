import { Type } from '@angular/core';

export interface SidebarLinksModel {
  id: number;
  name: string;
  url: string;
  iconPath?: Type<any>;
}
