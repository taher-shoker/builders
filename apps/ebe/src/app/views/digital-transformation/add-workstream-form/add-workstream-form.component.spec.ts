import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddWorkstreamFormComponent } from './add-workstream-form.component';

describe('AddWorkstreamFormComponent', () => {
  let component: AddWorkstreamFormComponent;
  let fixture: ComponentFixture<AddWorkstreamFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkstreamFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddWorkstreamFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
