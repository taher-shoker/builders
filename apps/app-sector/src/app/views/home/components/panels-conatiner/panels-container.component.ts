import { Component, input, InputSignal, OnInit } from '@angular/core';

@Component({
  selector: 'stc-apps-panels-container',
  templateUrl: './panels-container.component.html',
  styleUrl: './panels-container.component.scss',
})
export class PanelsContainerComponent {
  categoryName: InputSignal<string> = input('');
}
