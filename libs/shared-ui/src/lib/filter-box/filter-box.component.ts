import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'stc-apps-filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.scss'],
})
export class FilterBoxComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  privilages = [];
  addUserNavigate(): void {
    this.router.navigate(['./add-user'], { relativeTo: this.route });
  }
}
