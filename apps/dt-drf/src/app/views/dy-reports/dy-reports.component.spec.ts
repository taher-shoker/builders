import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestonesSettingComponent } from './dy-reports.component';

describe('MilestonesSettingComponent', () => {
  let component: MilestonesSettingComponent;
  let fixture: ComponentFixture<MilestonesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestonesSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestonesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
