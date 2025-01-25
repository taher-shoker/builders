import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletedCadProjectComponent } from './deleted-cad-project.component';

describe('DeletedCadProjectComponent', () => {
  let component: DeletedCadProjectComponent;
  let fixture: ComponentFixture<DeletedCadProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedCadProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletedCadProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
