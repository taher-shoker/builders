import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  input,
  InputSignal,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
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
  @ContentChildren(TemplateRef) tabContents!: QueryList<TemplateRef<any>>;
  public templates: TemplateRef<any>[] = [];

  @Output() changeSelectValue: EventEmitter<any> = new EventEmitter();
  @ViewChild('tabsContainer', { static: false }) tabsContainer!: ElementRef;
  scores: InputSignal<any[] | any> = input([]);
  private onChange: (value: any) => void = () => {};
  private onTouched: any = () => {};
  public disabled = false;
  public value: any;
  selectedIndex = 0;

  ngAfterContentInit(): void {
    this.templates = this.tabContents.toArray();
    this.handelSelectTab();
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
    if (this.templates.length > 0) {
      this.selectTab(this.selectedIndex);
    }
  }

  updateTabs() {
    this.templates = this.tabContents.toArray();
    this.handelSelectTab();
  }

  handelSelectTabByValue(value: any) {
    const tabIndex = this.scores().findIndex(
      (score: any) => score.value === value
    );
    if (tabIndex !== -1) {
      this.selectTab(tabIndex);
    }
  }

  selectTab(index: number) {
    this.selectedIndex = index;
    this.value = this.scores()[index]?.value;
    this.changeValue();
  }

  onTabChange(event: any) {
    this.selectedIndex = event.index;
    this.value = this.scores()[this.selectedIndex]?.value;
    this.changeValue();
  }

  handleChangeTab(value: any) {
    this.changeSelectValue.emit(value);
  }
}
