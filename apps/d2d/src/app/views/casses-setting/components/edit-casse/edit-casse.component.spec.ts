import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCasseComponent } from './edit-casse.component';

describe('EditCasseComponent', () => {
  let component: EditCasseComponent;
  let fixture: ComponentFixture<EditCasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCasseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
