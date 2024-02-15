import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MilestoneFormComponent } from './milestone-form.component';

describe('MilestoneFormComponent', () => {
  let component: MilestoneFormComponent;
  let fixture: ComponentFixture<MilestoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MilestoneFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MilestoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
