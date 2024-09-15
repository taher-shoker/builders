import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  Output,
  QueryList,
} from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'stc-apps-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> | any;
  @Output() changeSelectValue: EventEmitter<any> = new EventEmitter();
  value: any;

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.handelSelectTab();
    }, 0);
  }

  changeValue() {    
    this.changeSelectValue.emit(this.value);
  }

  handelSelectTab() {
    const activeTabs = this.tabs?.filter((tab: TabComponent) => tab.active());
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
    this.tabs.forEach((tab: TabComponent) => {
      tab.selectTab.subscribe(() => {
        // console.log(tab);
        this.selectTab(tab);
        this.value = tab.value();
        this.changeValue();
      });
    });
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach((tab: TabComponent) => (tab.active.set(false)));

    // activate the tab the user has clicked on.
    tab.active.set(true);

    this.value = tab.value();
    this.changeValue();
  }
}
