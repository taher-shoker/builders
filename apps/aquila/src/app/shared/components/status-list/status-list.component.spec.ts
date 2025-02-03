import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusListComponent } from './status-list.component';

describe('TaskStatusListComponent', () => {
  let component: TaskStatusListComponent;
  let fixture: ComponentFixture<TaskStatusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskStatusListComponent],
    });
    fixture = TestBed.createComponent(TaskStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
