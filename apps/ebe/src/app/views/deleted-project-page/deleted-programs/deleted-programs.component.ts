import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityLogService } from '../../../services/activity-logs.service';
import { Subject, takeUntil } from 'rxjs';
import { DeletedProgram } from '../../../models/deleted-items';
import { PSRProjectCardComponent } from '../../PSR/components/project-card/project-card.component';

@Component({
  selector: 'stc-apps-deleted-programs',
  standalone: true,
  imports: [CommonModule , PSRProjectCardComponent],
  templateUrl: './deleted-programs.component.html',
  styleUrl: './deleted-programs.component.scss',
})
export class DeletedProgramsComponent {
  activityLogService = inject(ActivityLogService);
  $endSubs:Subject<any> = new Subject();
  deletedPrograms = signal<DeletedProgram[]>([]);
  ngOnInit()
  {
    this.getDeletedPrograms(false)
  }
  private getDeletedPrograms(isDetails:boolean)
  {
    this.activityLogService.getDeletedPrograms("PSR" , isDetails).pipe(takeUntil(this.$endSubs)).subscribe({
      next : (programs:DeletedProgram[]) => {
        // console.log(programs);
        this.deletedPrograms.set(programs);
      }
    })
  }
  ngOnDestroy()
  {
    this.$endSubs.complete();
  }
  getProgramId(id:any)
  {
    console.log(id);
    
  }
}
