import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BannerDataService } from '@stc-apps/shared-ui';
import { MilestonesService } from '../../milestones.service';

@Component({
  selector: 'stc-apps-edit-milestone',
  templateUrl: './edit-milestone.component.html',
  styleUrls: ['./edit-milestone.component.scss'],
})
export class EditMilestineComponent implements OnInit {
  milestoneId!: string;
  milestoneData!: any;

  constructor(
    private bannerDataService: BannerDataService,
    public milestonesService: MilestonesService,
    public route: ActivatedRoute
  ) {}
  getMilestone(id: number) {
    this.milestonesService.getMilestone(id).subscribe((res: any) => {
      this.milestoneData = res;
    });
  }
  ngOnInit(): void {
    this.milestoneId = this.route.snapshot.params['id'];
    this.getMilestone(+this.milestoneId);
    this.bannerDataService.updateData({
      title: '',
      text: '',
    });
  }
}
