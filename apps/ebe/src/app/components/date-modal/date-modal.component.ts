import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
type Position = "center" | "top" | "bottom" | "left" | "right" | "topleft" | "topright" | "bottomleft" | "bottomright";
@Component({
  selector: 'stc-apps-date-modal',
  standalone: true,
  imports: [CommonModule , DialogModule],
  templateUrl: './date-modal.component.html',
  styleUrl: './date-modal.component.scss',
})
export class DateModalComponent {
  currentMonth:InputSignal<number> = input.required<number>()
  currentYear:InputSignal<number> = input.required<number>()
  currentMonthName:string = '';
  visible: boolean = false;
  position!:Position;
  months:string[] = ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'];
  ngOnInit()
  {
    this.currentMonthName = this.months[this.currentMonth()];
  }
  showDialog(position:Position) {    
    this.position = position;
    this.visible = true;
  }
}
