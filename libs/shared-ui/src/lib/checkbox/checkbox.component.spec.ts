import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent<any>;
  let fixture: ComponentFixture<CheckboxComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [FormsModule, ReactiveFormsModule], // Ensure FormsModule and ReactiveFormsModule are imported
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default properties', () => {
    expect(component.disabled).toBeFalsy();
  });

  it('should log value on change', () => {
    spyOn(console, 'log');
    component.onChangeValue(true);
    expect(console.log).toHaveBeenCalledWith(true);
  });
});
