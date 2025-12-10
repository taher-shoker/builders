import { Component, input } from '@angular/core';
import { AttributeItem } from '../../models/attribute-item.model';

@Component({
  selector: 'stc-apps-kpi-attributes-list',
  templateUrl: './kpi-attributes-list.component.html',
  styleUrls: ['./kpi-attributes-list.component.scss'],
})
export class KpiAttributesListComponent {
  attributes = input<AttributeItem[]>([]);
  loading = input<boolean>(false);
  // Render 5 skeleton cards while loading
  skeletons = Array.from({ length: 5 });
}
