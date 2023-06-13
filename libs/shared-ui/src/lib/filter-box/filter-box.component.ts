import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stc-apps-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
})
export class FilterBoxComponent {
  @Input()
  addNavigate!: () => void;
  @Input() addBtnLabel!: string;
  constructor(public router: Router, public route: ActivatedRoute) {}

  onAddClick() {
    this.addNavigate();
  }
  privilages = [];
}
