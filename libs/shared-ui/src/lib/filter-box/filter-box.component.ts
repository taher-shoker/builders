import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stc-apps-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
  standalone : false
})
export class FilterBoxComponent {
  @Input()
  addNavigate!: () => void;
  @Input()
  searchFilter!: (event: Event) => void;
  @Input() addBtnLabel!: string;
  constructor(public router: Router, public route: ActivatedRoute) {}

  onAddClick() {
    this.addNavigate();
  }
  privilages = [
    { name: 'Creator', value: 'creator' },
    { name: 'Approved', value: 'approved' },
  ];
  teams = [
    { name: 'Filed Operation', value: 'filed_operation' },
    { name: 'Customer Care ', value: 'customer_care' },
    { name: 'Digital Care', value: 'digital_care' },
    { name: 'Fraud', value: 'fraud' },
  ];
  jobs = [
    { name: 'Filed Operation', value: 'filed_operation' },
    { name: 'Customer Care ', value: 'customer_care' },
    { name: 'Digital Care', value: 'digital_care' },
  ];
}
