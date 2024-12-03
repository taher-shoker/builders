import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPsrProjectFormComponent } from './add-psr-project-form.component';

describe('AddPsrProjectFormComponent', () => {
  let component: AddPsrProjectFormComponent;
  let fixture: ComponentFixture<AddPsrProjectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPsrProjectFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPsrProjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
