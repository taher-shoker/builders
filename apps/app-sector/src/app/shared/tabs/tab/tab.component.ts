import { Component,  InputSignal,  WritableSignal, input, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'stc-apps-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  active: WritableSignal<boolean> = signal(false);
  value: InputSignal<any> = input(null);

  public selectTab: Subject<any> = new Subject();

  handelChangeTab() {
    this.selectTab.next(this.value());
  }
}
