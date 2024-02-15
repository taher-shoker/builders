import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditMilestineComponent } from './edit-milestone.component';

describe('EditMilestineComponent', () => {
  let component: EditMilestineComponent;
  let fixture: ComponentFixture<EditMilestineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMilestineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditMilestineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
