import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Output,
  QueryList,
} from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'stc-apps-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TabsComponent),
      multi: true,
    },
  ],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent> | any;
  @Output() changeSelectValue: EventEmitter<any> = new EventEmitter();

  private onChange: (value: any) => void = () => {};
  private onTouched: any = () => {};
  public disabled: boolean = false;
  public value: any;

  ngAfterContentInit(): void {
    this.tabs.changes.subscribe(() => {
      if (this.tabs.length > 0) {
        this.handelSelectTab();
      }
    });
  }

  writeValue(value: any): void {
    this.value = value;
    this.handelSelectTabByValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  changeValue() {
    this.changeSelectValue.emit(this.value);
    this.onChange(this.value);
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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

  handelSelectTabByValue(value: any) {
    const activeTabs = this.tabs?.filter(
      (tab: TabComponent) => tab.value == this.value
    );
    if (!!activeTabs) this.selectTab(activeTabs);
  }

  selectTab(tab: TabComponent) {
    if (!tab) return;
    // deactivate all tabs
    this.tabs.toArray().forEach((tab: TabComponent) => tab.active.set(false));

    // activate the tab the user has clicked on.
    tab.active.set(true);

    this.value = tab.value();
    this.changeValue();
  }
}
