import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedProjectsComponent } from './deleted-projects.component';

describe('DeletedProjectsComponent', () => {
  let component: DeletedProjectsComponent;
  let fixture: ComponentFixture<DeletedProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
