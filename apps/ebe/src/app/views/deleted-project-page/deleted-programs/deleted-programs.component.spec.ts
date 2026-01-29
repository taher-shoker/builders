import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedProgramsComponent } from './deleted-programs.component';

describe('DeletedProgramsComponent', () => {
  let component: DeletedProgramsComponent;
  let fixture: ComponentFixture<DeletedProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedProgramsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
