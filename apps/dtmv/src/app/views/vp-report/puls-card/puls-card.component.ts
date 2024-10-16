import { Component, Input } from '@angular/core';
import { ReflectionLevel } from '../../../services/models/milestones.models';

@Component({
  selector: 'stc-apps-puls-card',
  templateUrl: './puls-card.component.html',
  styleUrls: ['./puls-card.component.scss'],
})
export class PulsCardComponent {
  @Input({ required: true }) state!: string;
}
