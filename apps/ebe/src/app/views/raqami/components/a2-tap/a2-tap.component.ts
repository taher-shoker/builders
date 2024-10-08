import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUiModule } from '@stc-apps/shared-ui';

@Component({
  selector: 'stc-apps-a2-tap',
  standalone: true,
  imports: [CommonModule, SharedUiModule],
  templateUrl: './a2-tap.component.html',
  styleUrl: './a2-tap.component.scss',
})
export class A2TapComponent {}
