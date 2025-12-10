import { Component, computed, ContentChild, EventEmitter, input, Output, TemplateRef } from '@angular/core';

export interface TabConfig {
  label: string;
  key: string;
  disabled?: boolean;
}

@Component({
  selector: 'stc-apps-tabs-navigation',
  templateUrl: './tabs-navigation.component.html',
  styleUrls: ['./tabs-navigation.component.scss'],
})
export class TabsNavigationComponent {
  tabs = input<TabConfig[]>([]);
  selectedTab = input<string>('');
  @Output() tabChanged = new EventEmitter<string>();
  @ContentChild('tabContent', { static: true }) tabContentTemplate!: TemplateRef<any>;

  activeTabIndex = computed(() => {
    const currentSelected = this.selectedTab();
    const tabsList = this.tabs();
    const index = tabsList.findIndex(tab => tab.key === currentSelected);
    return index >= 0 ? index : 0;
  });


  onTabChanged(event: any): void {
    const tabsList = this.tabs();
    if (event.index >= 0 && event.index < tabsList.length) {
      const selectedTab = tabsList[event.index];
      this.tabChanged.emit(selectedTab.key);
    }
  }
}
