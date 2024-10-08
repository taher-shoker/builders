import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectDetailsCardComponent } from './project-details-card.component';

describe('ProjectDetailsCardComponent', () => {
  let component: ProjectDetailsCardComponent;
  let fixture: ComponentFixture<ProjectDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
