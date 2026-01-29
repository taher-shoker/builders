import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedProjectsPageComponent } from './deleted-projects-page.component';

describe('DeletedProjectsPageComponent', () => {
  let component: DeletedProjectsPageComponent;
  let fixture: ComponentFixture<DeletedProjectsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedProjectsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedProjectsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
