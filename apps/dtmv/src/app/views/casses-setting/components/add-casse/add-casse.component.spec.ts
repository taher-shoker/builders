import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCasseComponent } from './add-casse.component';

describe('AddCasseComponent', () => {
  let component: AddCasseComponent;
  let fixture: ComponentFixture<AddCasseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCasseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
